import { Student } from "./student.model";
import { User } from "../user/user.model";
import { ICreateStudentInput, IStudentFilters, ExamStatus } from "./student.interface";
import { Types } from "mongoose";
import { QuestionSetService } from "../questionSet/questionSet.service";
// Updated: questionText + isCorrect recalculation on backend v2

// Generate unique exam ID
const generateExamId = async (): Promise<string> => {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `BACIELTS${currentYear}`;

    const lastStudent = await Student.findOne({
        examId: new RegExp(`^${prefix}`),
    })
        .sort({ examId: -1 })
        .limit(1);

    let nextNumber = 1;
    if (lastStudent) {
        const lastNumber = parseInt(lastStudent.examId.slice(-4), 10);
        nextNumber = lastNumber + 1;
    }

    const serialNumber = nextNumber.toString().padStart(4, "0");
    return `${prefix}${serialNumber}`;
};

// Create new student with auto ID generation
const createStudent = async (
    data: ICreateStudentInput,
    adminId: string
) => {
    // Check if email already exists
    const existingStudent = await Student.findOne({ email: data.email });
    if (existingStudent) {
        throw new Error("A student with this email already exists");
    }

    // Check if phone already exists
    const existingPhone = await Student.findOne({ phone: data.phone });
    if (existingPhone) {
        throw new Error("A student with this phone number already exists");
    }

    // Generate unique exam ID
    const examId = await generateExamId();

    // Auto-generate password (using phone number)
    const autoPassword = data.phone;

    // Create student
    const student = await Student.create({
        ...data,
        examId,
        password: autoPassword,
        examDate: new Date(data.examDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
        assignedSets: {
            listeningSetNumber: data.listeningSetNumber,
            readingSetNumber: data.readingSetNumber,
            writingSetNumber: data.writingSetNumber,
        },
        createdBy: new Types.ObjectId(adminId),
    });

    // Also create a user account for student dashboard access
    const userExists = await User.findOne({ email: data.email });
    if (!userExists) {
        const user = await User.create({
            name: data.nameEnglish,
            email: data.email,
            phone: data.phone,
            nid: data.nidNumber,
            password: autoPassword,
            role: "user",
        });

        // Link user to student
        student.userId = user._id as Types.ObjectId;
        await student.save();
    }

    return {
        student: {
            _id: student._id,
            examId: student.examId,
            nameEnglish: student.nameEnglish,
            email: student.email,
            phone: student.phone,
            examDate: student.examDate,
            paymentStatus: student.paymentStatus,
            examStatus: student.examStatus,
        },
        credentials: {
            examId: student.examId,
            email: data.email,
            password: autoPassword, // Return plain password for admin to share
        },
    };
};

// Get all students with filters and pagination
const getAllStudents = async (
    filters: IStudentFilters,
    page: number = 1,
    limit: number = 10
) => {
    const query: Record<string, unknown> = {};

    // Search by name, email, phone, or exam ID
    if (filters.searchTerm) {
        query.$or = [
            { nameEnglish: { $regex: filters.searchTerm, $options: "i" } },
            { nameBengali: { $regex: filters.searchTerm, $options: "i" } },
            { email: { $regex: filters.searchTerm, $options: "i" } },
            { phone: { $regex: filters.searchTerm, $options: "i" } },
            { examId: { $regex: filters.searchTerm, $options: "i" } },
        ];
    }

    // Filter by exam status
    if (filters.examStatus) {
        query.examStatus = filters.examStatus;
    }

    // Filter by payment status
    if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
    }

    // Filter by specific exam date
    if (filters.examDate) {
        const date = new Date(filters.examDate);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        query.examDate = { $gte: date, $lt: nextDate };
    }

    // Filter by date range
    if (filters.fromDate || filters.toDate) {
        query.examDate = {};
        if (filters.fromDate) {
            (query.examDate as Record<string, Date>).$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
            (query.examDate as Record<string, Date>).$lte = new Date(filters.toDate);
        }
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
        Student.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Student.countDocuments(query),
    ]);

    return {
        students,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// Get student by ID
const getStudentById = async (id: string) => {
    const student = await Student.findById(id)
        .select("-password")
        .populate("createdBy", "name email")
        .lean();

    if (!student) {
        throw new Error("Student not found");
    }

    return student;
};

// Get student by exam ID
const getStudentByExamId = async (examId: string) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() })
        .select("-password")
        .lean();

    if (!student) {
        throw new Error("Student not found with this Exam ID");
    }

    return student;
};

// Update student
const updateStudent = async (id: string, updateData: Partial<ICreateStudentInput>) => {
    const student = await Student.findById(id);
    if (!student) {
        throw new Error("Student not found");
    }

    // Build update object
    const updateObj: Record<string, unknown> = { ...updateData };

    // Handle date fields
    if (updateData.examDate) {
        updateObj.examDate = new Date(updateData.examDate);
    }
    if (updateData.paymentDate) {
        updateObj.paymentDate = new Date(updateData.paymentDate);
    }

    // Handle assigned sets
    if (updateData.listeningSetNumber !== undefined) {
        updateObj["assignedSets.listeningSetNumber"] = updateData.listeningSetNumber;
    }
    if (updateData.readingSetNumber !== undefined) {
        updateObj["assignedSets.readingSetNumber"] = updateData.readingSetNumber;
    }
    if (updateData.writingSetNumber !== undefined) {
        updateObj["assignedSets.writingSetNumber"] = updateData.writingSetNumber;
    }

    // Remove individual set fields from root
    delete updateObj.listeningSetNumber;
    delete updateObj.readingSetNumber;
    delete updateObj.writingSetNumber;

    const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { $set: updateObj },
        { new: true, runValidators: true }
    ).select("-password");

    return updatedStudent;
};

// Delete student
const deleteStudent = async (id: string) => {
    const student = await Student.findById(id);
    if (!student) {
        throw new Error("Student not found");
    }

    // Also delete associated user account
    if (student.userId) {
        await User.findByIdAndDelete(student.userId);
    }

    await Student.findByIdAndDelete(id);

    return { message: "Student deleted successfully" };
};

// Verify exam ID for exam start
const verifyExamId = async (examId: string) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() })
        .select("examId nameEnglish examStatus paymentStatus examDate isActive canRetake examSessionId assignedSets examStartedAt completedModules scores")
        .lean();

    if (!student) {
        return { valid: false, message: "Invalid Exam ID" };
    }

    // Check if student is active
    if (!student.isActive) {
        return { valid: false, message: "This account has been deactivated" };
    }

    // Check payment status
    if (student.paymentStatus !== "paid") {
        return { valid: false, message: "Payment not confirmed. Please contact admin." };
    }

    // NOTE: Exam date check removed - students can now take exam anytime

    // Check if already completed
    if (student.examStatus === "completed" && !student.canRetake) {
        return {
            valid: false,
            message: "You have already completed this exam",
            completedModules: student.completedModules || [],
            scores: student.scores,
        };
    }

    if (student.examStatus === "terminated") {
        return { valid: false, message: "Your exam was terminated due to violations" };
    }

    // If exam is in-progress, return the existing session info for resume
    if (student.examStatus === "in-progress" && student.examSessionId) {
        return {
            valid: true,
            resumeExam: true,
            sessionId: student.examSessionId,
            student: {
                examId: student.examId,
                name: student.nameEnglish,
            },
            assignedSets: student.assignedSets,
            startedAt: student.examStartedAt,
            completedModules: student.completedModules || [],
            scores: student.scores,
        };
    }

    return {
        valid: true,
        student: {
            examId: student.examId,
            name: student.nameEnglish,
        },
        completedModules: student.completedModules || [],
        scores: student.scores,
    };
};

// Start exam session
const startExam = async (
    examId: string,
    ipAddress?: string,
    browserFingerprint?: string
) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() });

    if (!student) {
        throw new Error("Student not found");
    }

    // Check verification
    const verification = await verifyExamId(examId);
    if (!verification.valid) {
        throw new Error(verification.message);
    }

    // If exam is already in progress, return existing session for resume
    if (verification.resumeExam && verification.sessionId) {
        return {
            sessionId: verification.sessionId,
            examId: student.examId,
            studentName: student.nameEnglish,
            assignedSets: student.assignedSets,
            startedAt: student.examStartedAt,
            resumed: true,
            completedModules: student.completedModules || [],
            scores: student.scores,
        };
    }

    // Start new exam
    student.examStatus = "in-progress";
    student.examStartedAt = new Date();
    student.ipAddress = ipAddress;
    student.browserFingerprint = browserFingerprint;

    // Generate unique session ID
    const sessionId = `SESSION-${student.examId}-${Date.now()}`;
    student.examSessionId = sessionId;

    // Reset retake flag if it was set
    if (student.canRetake) {
        student.canRetake = false;
    }

    await student.save();

    return {
        sessionId,
        examId: student.examId,
        studentName: student.nameEnglish,
        assignedSets: student.assignedSets,
        startedAt: student.examStartedAt,
        resumed: false,
        completedModules: student.completedModules || [],
        scores: student.scores,
    };
};

// Report violation
const reportViolation = async (
    examId: string,
    violationType: "tab-switch" | "fullscreen-exit" | "browser-close" | "refresh" | "dev-tools" | "other"
) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() });

    if (!student) {
        throw new Error("Student not found");
    }

    if (student.examStatus !== "in-progress") {
        throw new Error("No active exam session");
    }

    // Count existing violations of this type
    const existingViolation = student.violations.find((v) => v.type === violationType);
    let violationCount = existingViolation ? existingViolation.count + 1 : 1;

    // Determine action based on violation count
    let action: "warning" | "deduction" | "terminated" = "warning";

    // Dev tools = immediate termination
    if (violationType === "dev-tools") {
        action = "terminated";
    } else if (violationCount >= 3) {
        action = "terminated";
    } else if (violationCount === 2) {
        action = "deduction";
    }

    // Add violation record
    student.violations.push({
        type: violationType,
        timestamp: new Date(),
        count: violationCount,
        action,
    });
    student.totalViolations += 1;

    // Terminate exam if action is terminated
    if (action === "terminated") {
        student.examStatus = "terminated";
        student.examCompletedAt = new Date();
    }

    await student.save();

    return {
        action,
        violationCount,
        totalViolations: student.totalViolations,
        examTerminated: action === "terminated",
    };
};

// Reset exam (admin only)
const resetExam = async (examId: string) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() });

    if (!student) {
        throw new Error("Student not found");
    }

    student.examStatus = "not-started";
    student.examStartedAt = undefined;
    student.examCompletedAt = undefined;
    student.examSessionId = undefined;
    student.violations = [];
    student.totalViolations = 0;
    student.scores = undefined;
    student.canRetake = true;

    await student.save();

    return {
        message: "Exam reset successfully",
        examId: student.examId,
        canRetake: true,
    };
};

// Complete exam and save scores
const completeExam = async (
    examId: string,
    scores: {
        listening?: { score: number; total: number; band: number };
        reading?: { score: number; total: number; band: number };
        writing?: { task1Words: number; task2Words: number; band: number };
    }
) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() });

    if (!student) {
        throw new Error("Student not found");
    }

    if (student.examStatus === "completed") {
        throw new Error("Exam has already been completed");
    }

    if (student.examStatus !== "in-progress") {
        throw new Error("Exam session not found or not in progress");
    }

    // Build scores object
    const examScores: Record<string, unknown> = {};

    if (scores.listening) {
        examScores.listening = {
            raw: scores.listening.score,
            band: scores.listening.band,
            correctAnswers: scores.listening.score,
            totalQuestions: scores.listening.total,
        };
    }

    if (scores.reading) {
        examScores.reading = {
            raw: scores.reading.score,
            band: scores.reading.band,
            correctAnswers: scores.reading.score,
            totalQuestions: scores.reading.total,
        };
    }

    if (scores.writing) {
        // Estimate task bands from overall writing band
        const writingBand = scores.writing.band;
        examScores.writing = {
            task1Band: writingBand,
            task2Band: writingBand,
            overallBand: writingBand,
        };
    }

    // Calculate overall band if we have at least listening and reading
    if (examScores.listening && examScores.reading) {
        const listeningBand = (examScores.listening as any).band || 0;
        const readingBand = (examScores.reading as any).band || 0;
        const writingBand = (examScores.writing as any)?.overallBand || 0;

        // If writing exists, average all three; otherwise just L+R
        if (writingBand > 0) {
            examScores.overall = Math.round(((listeningBand + readingBand + writingBand) / 3) * 2) / 2;
        } else {
            examScores.overall = Math.round(((listeningBand + readingBand) / 2) * 2) / 2;
        }
    }

    // Update student record
    student.scores = examScores as any;
    student.examStatus = "completed";
    student.examCompletedAt = new Date();

    await student.save();

    return {
        examId: student.examId,
        name: student.nameEnglish,
        status: student.examStatus,
        completedAt: student.examCompletedAt,
        scores: student.scores,
    };
};

// Save individual module score
const saveModuleScore = async (
    examId: string,
    module: "listening" | "reading" | "writing",
    scoreData: {
        score?: number;
        total?: number;
        band: number;
        task1Words?: number;
        task2Words?: number;
        answers?: any;
    }
) => {
    console.log("[saveModuleScore] Starting for examId:", examId, "module:", module);
    console.log("[saveModuleScore] scoreData:", JSON.stringify(scoreData, null, 2));

    // First find the student
    const student = await Student.findOne({ examId: examId.toUpperCase() });

    if (!student) {
        throw new Error("Student not found");
    }

    // Check if module already completed
    const completedModules = student.completedModules || [];
    if (completedModules.includes(module)) {
        throw new Error(`${module} exam has already been completed`);
    }

    // Build update object using dot notation for nested fields
    const updateObj: Record<string, any> = {
        // We will update examStatus later if needed, to avoid race conditions
    };

    // Set module-specific scores and answers
    if (module === "listening") {
        updateObj["scores.listening"] = {
            raw: scoreData.score || 0,
            band: scoreData.band,
            correctAnswers: scoreData.score || 0,
            totalQuestions: scoreData.total || 40,
        };
        if (scoreData.answers && Array.isArray(scoreData.answers)) {
            // Fetch correct answers from question set
            try {
                const listeningSetNumber = student.assignedSets?.listeningSetNumber;
                if (listeningSetNumber) {
                    const correctAnswerMap = await QuestionSetService.getAnswersForGrading("LISTENING", listeningSetNumber);
                    // Merge correct answers with student answers and RECALCULATE isCorrect
                    let correctCount = 0;
                    const answersWithCorrect = scoreData.answers.map((ans: any) => {
                        const studentAns = (ans.studentAnswer || ans.studentAnswerFull || "").toString().trim().toLowerCase();
                        const correctAnswers = correctAnswerMap[Number(ans.questionNumber)];

                        let isCorrect = false;
                        let canonicalCorrect = "";

                        if (Array.isArray(correctAnswers)) {
                            isCorrect = studentAns !== "" && correctAnswers.some(c => c.toString().trim().toLowerCase() === studentAns);
                            canonicalCorrect = correctAnswers[0]?.toString() || "";
                        } else {
                            const correctAns = (correctAnswers || "").toString().trim().toLowerCase();
                            isCorrect = studentAns !== "" && studentAns === correctAns;
                            canonicalCorrect = correctAnswers?.toString() || "";
                        }

                        if (isCorrect) correctCount++;

                        return {
                            questionNumber: ans.questionNumber,
                            questionText: ans.questionText || "",
                            questionType: ans.questionType || "fill-in-blank",
                            studentAnswer: ans.studentAnswer || "", // The extracted letter or short answer
                            studentAnswerFull: ans.studentAnswerFull || ans.studentAnswer || "", // Full answer for reference
                            correctAnswer: canonicalCorrect || ans.correctAnswer || "",
                            isCorrect: isCorrect
                        };
                    });
                    updateObj["examAnswers.listening"] = answersWithCorrect;
                    // Update correct answers count in score
                    updateObj["scores.listening"].correctAnswers = correctCount;
                    updateObj["scores.listening"].raw = correctCount;
                } else {
                    updateObj["examAnswers.listening"] = scoreData.answers;
                }
            } catch (err) {
                console.error("Failed to fetch correct answers for listening:", err);
                updateObj["examAnswers.listening"] = scoreData.answers;
            }
        }
    } else if (module === "reading") {
        updateObj["scores.reading"] = {
            raw: scoreData.score || 0,
            band: scoreData.band,
            correctAnswers: scoreData.score || 0,
            totalQuestions: scoreData.total || 40,
        };
        if (scoreData.answers && Array.isArray(scoreData.answers)) {
            // Fetch correct answers from question set
            try {
                const readingSetNumber = student.assignedSets?.readingSetNumber;
                if (readingSetNumber) {
                    const correctAnswerMap = await QuestionSetService.getAnswersForGrading("READING", readingSetNumber);
                    // Merge correct answers with student answers and RECALCULATE isCorrect
                    let correctCount = 0;
                    const answersWithCorrect = scoreData.answers.map((ans: any) => {
                        const studentAns = (ans.studentAnswer || ans.studentAnswerFull || "").toString().trim().toLowerCase();
                        const correctAnswers = correctAnswerMap[Number(ans.questionNumber)];

                        let isCorrect = false;
                        let canonicalCorrect = "";

                        if (Array.isArray(correctAnswers)) {
                            isCorrect = studentAns !== "" && correctAnswers.some(c => c.toString().trim().toLowerCase() === studentAns);
                            canonicalCorrect = correctAnswers[0]?.toString() || "";
                        } else {
                            const correctAns = (correctAnswers || "").toString().trim().toLowerCase();
                            isCorrect = studentAns !== "" && studentAns === correctAns;
                            canonicalCorrect = correctAnswers?.toString() || "";
                        }

                        if (isCorrect) correctCount++;

                        return {
                            questionNumber: ans.questionNumber,
                            questionText: ans.questionText || "",
                            questionType: ans.questionType || "fill-in-blank",
                            studentAnswer: ans.studentAnswer || "",
                            studentAnswerFull: ans.studentAnswerFull || ans.studentAnswer || "",
                            correctAnswer: canonicalCorrect || ans.correctAnswer || "",
                            isCorrect: isCorrect
                        };
                    });
                    updateObj["examAnswers.reading"] = answersWithCorrect;
                    // Update correct answers count in score
                    updateObj["scores.reading"].correctAnswers = correctCount;
                    updateObj["scores.reading"].raw = correctCount;
                } else {
                    updateObj["examAnswers.reading"] = scoreData.answers;
                }
            } catch (err) {
                console.error("Failed to fetch correct answers for reading:", err);
                updateObj["examAnswers.reading"] = scoreData.answers;
            }
        }
    } else if (module === "writing") {
        updateObj["scores.writing"] = {
            task1Band: scoreData.band,
            task2Band: scoreData.band,
            overallBand: scoreData.band,
        };
        if (scoreData.answers) {
            console.log("[saveModuleScore] Writing answers to save:", scoreData.answers);
            updateObj["examAnswers.writing"] = {
                task1: scoreData.answers.task1 || "",
                task2: scoreData.answers.task2 || "",
            };
            console.log("[saveModuleScore] updateObj examAnswers.writing:", updateObj["examAnswers.writing"]);
        } else {
            console.log("[saveModuleScore] No writing answers in scoreData!");
        }
    }

    // Calculate overall band
    const existingScores = student.scores || {} as any;
    const listeningBand = module === "listening" ? scoreData.band : (existingScores.listening?.band || 0);
    const readingBand = module === "reading" ? scoreData.band : (existingScores.reading?.band || 0);
    const writingBand = module === "writing" ? scoreData.band : (existingScores.writing?.overallBand || 0);

    const bands = [listeningBand, readingBand, writingBand].filter(b => b > 0);
    if (bands.length > 0) {
        const sum = bands.reduce((a, b) => a + b, 0);
        updateObj["scores.overall"] = Math.round((sum / bands.length) * 2) / 2;
    }

    console.log("[saveModuleScore] Final updateObj:", JSON.stringify(updateObj, null, 2));

    // Use findOneAndUpdate with $addToSet to avoid race conditions when multiple modules complete at once
    const updatedStudent = await Student.findOneAndUpdate(
        { examId: examId.toUpperCase() },
        {
            $set: updateObj,
            $addToSet: { completedModules: module }
        },
        { new: true, runValidators: true }
    );

    if (!updatedStudent) {
        throw new Error("Failed to update student");
    }

    // After atomic update, check if all modules are now completed
    const currentCompletedCount = updatedStudent.completedModules?.length || 0;
    if (currentCompletedCount >= 3 && updatedStudent.examStatus !== "completed") {
        updatedStudent.examStatus = "completed";
        updatedStudent.examCompletedAt = new Date();
        await updatedStudent.save();
    } else if (updatedStudent.examStatus === "not-started") {
        updatedStudent.examStatus = "in-progress";
        await updatedStudent.save();
    }

    console.log("[saveModuleScore] Updated student completedModules:", updatedStudent.completedModules);
    console.log("[saveModuleScore] Updated student writing answers:", updatedStudent.examAnswers?.writing);

    return {
        examId: updatedStudent.examId,
        module,
        band: scoreData.band,
        completedModules: updatedStudent.completedModules,
        allCompleted: (updatedStudent.completedModules?.length || 0) >= 3,
        scores: updatedStudent.scores,
    };
};


// Get exam results for a student
const getExamResults = async (examId: string) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() })
        .select("examId nameEnglish scores examStatus examCompletedAt violations totalViolations")
        .lean();

    if (!student) {
        throw new Error("Student not found");
    }

    if (student.examStatus === "not-started") {
        throw new Error("Exam has not been taken yet");
    }

    if (student.examStatus === "in-progress") {
        throw new Error("Exam is still in progress");
    }

    return {
        examId: student.examId,
        name: student.nameEnglish,
        status: student.examStatus,
        completedAt: student.examCompletedAt,
        scores: student.scores,
        violations: {
            total: student.totalViolations,
            details: student.violations,
        },
    };
};

// Get all results (admin)
const getAllResults = async (
    filters: IStudentFilters,
    page: number = 1,
    limit: number = 10
) => {
    const query: Record<string, unknown> = {
        examStatus: { $in: ["completed", "terminated", "in-progress"] },
    };

    if (filters.searchTerm) {
        query.$or = [
            { nameEnglish: { $regex: filters.searchTerm, $options: "i" } },
            { email: { $regex: filters.searchTerm, $options: "i" } },
            { examId: { $regex: filters.searchTerm, $options: "i" } },
        ];
    }

    if (filters.examStatus && ["completed", "terminated", "in-progress"].includes(filters.examStatus)) {
        query.examStatus = filters.examStatus;
    }

    if (filters.fromDate || filters.toDate) {
        query.examCompletedAt = {};
        if (filters.fromDate) {
            (query.examCompletedAt as Record<string, Date>).$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
            (query.examCompletedAt as Record<string, Date>).$lte = new Date(filters.toDate);
        }
    }

    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
        Student.find(query)
            .select("examId nameEnglish email examStatus examCompletedAt scores totalViolations completedModules")
            .sort({ examCompletedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Student.countDocuments(query),
    ]);

    return {
        results,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// Get statistics (admin dashboard)
const getStatistics = async () => {
    const [
        totalStudents,
        pendingPayments,
        paidPayments,
        notStarted,
        inProgress,
        completed,
        terminated,
    ] = await Promise.all([
        Student.countDocuments({}),
        Student.countDocuments({ paymentStatus: "pending" }),
        Student.countDocuments({ paymentStatus: "paid" }),
        Student.countDocuments({ examStatus: "not-started" }),
        Student.countDocuments({ examStatus: "in-progress" }),
        Student.countDocuments({ examStatus: "completed" }),
        Student.countDocuments({ examStatus: "terminated" }),
    ]);

    // Get average scores
    const avgScores = await Student.aggregate([
        { $match: { examStatus: "completed", "scores.overall": { $gt: 0 } } },
        {
            $group: {
                _id: null,
                avgOverall: { $avg: "$scores.overall" },
                avgListening: { $avg: "$scores.listening.band" },
                avgReading: { $avg: "$scores.reading.band" },
                avgWriting: { $avg: "$scores.writing.overallBand" },
            },
        },
    ]);

    // Get today's exams
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayExams = await Student.countDocuments({
        examDate: { $gte: today, $lt: tomorrow },
    });

    return {
        totalStudents,
        payments: {
            pending: pendingPayments,
            paid: paidPayments,
        },
        examStatus: {
            notStarted,
            inProgress,
            completed,
            terminated,
        },
        averageScores: avgScores[0] || {
            avgOverall: 0,
            avgListening: 0,
            avgReading: 0,
            avgWriting: 0,
        },
        todayExams,
    };
};

// Update score for a module (admin)
const updateScore = async (studentId: string, module: string, score: number) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Student not found");
    }

    const moduleName = module.toLowerCase();

    if (!student.scores) {
        student.scores = {
            listening: { raw: 0, band: 0, correctAnswers: 0, totalQuestions: 40 },
            reading: { raw: 0, band: 0, correctAnswers: 0, totalQuestions: 40 },
            writing: { task1Band: 0, task2Band: 0, overallBand: 0 },
            overall: 0,
        };
    }

    if (moduleName === 'listening') {
        student.scores.listening.band = score;
    } else if (moduleName === 'reading') {
        student.scores.reading.band = score;
    } else if (moduleName === 'writing') {
        student.scores.writing.overallBand = score;
    }

    // Recalculate overall
    const listening = student.scores.listening?.band || 0;
    const reading = student.scores.reading?.band || 0;
    const writing = student.scores.writing?.overallBand || 0;

    const sum = listening + reading + writing;
    const count = [listening, reading, writing].filter(s => s > 0).length || 1;
    student.scores.overall = Math.round((sum / count) * 2) / 2; // Round to nearest 0.5

    await student.save();

    return student;
};

// Get answer sheet for a module (admin)
const getAnswerSheet = async (studentId: string, module: string) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Student not found");
    }

    const moduleName = module.toLowerCase();

    // Get answers based on module type
    let answers: any;

    if (moduleName === 'writing') {
        // Writing returns an object with task1 and task2
        answers = student.examAnswers?.writing || { task1: '', task2: '' };
    } else {
        // Listening and Reading - directly return saved answers
        // The saved answers already contain: questionNumber, questionText, studentAnswer, correctAnswer, isCorrect
        const savedAnswers = student.examAnswers?.[moduleName as 'listening' | 'reading'] || [];

        if (Array.isArray(savedAnswers) && savedAnswers.length > 0) {
            // Sort by question number and return as-is
            answers = savedAnswers
                .map((ans: any) => ({
                    questionNumber: ans.questionNumber,
                    questionText: ans.questionText || `Question ${ans.questionNumber}`,
                    questionType: ans.questionType || "fill-in-blank",
                    studentAnswer: ans.studentAnswer || "",
                    studentAnswerFull: ans.studentAnswerFull || ans.studentAnswer || "",
                    correctAnswer: ans.correctAnswer || "",
                    isCorrect: ans.isCorrect || false
                }))
                .sort((a: any, b: any) => a.questionNumber - b.questionNumber);
        } else {
            answers = [];
        }
    }

    console.log(`[getAnswerSheet] Module: ${moduleName}, Answers count:`, Array.isArray(answers) ? answers.length : 'writing');

    return {
        student: {
            _id: student._id,
            examId: student.examId,
            nameEnglish: student.nameEnglish,
        },
        module: moduleName,
        answers,
        scores: student.scores?.[moduleName as keyof typeof student.scores],
    };
};

// Helper function to get question texts from question set
const getQuestionTextsFromSet = async (setType: "LISTENING" | "READING", setNumber: number): Promise<Record<number, { questionText: string; correctAnswer: string }>> => {
    const questionData: Record<number, { questionText: string; correctAnswer: string }> = {};

    if (setType === "LISTENING") {
        const { ListeningTest } = await import("../listening/listening.model");
        const test = await ListeningTest.findOne({ testNumber: setNumber })
            .select("sections.questions.questionNumber sections.questions.questionText sections.questions.correctAnswer")
            .lean();

        if (test?.sections) {
            test.sections.forEach((section: any) => {
                section.questions?.forEach((q: any) => {
                    questionData[q.questionNumber] = {
                        questionText: q.questionText || "",
                        correctAnswer: q.correctAnswer || ""
                    };
                });
            });
        }
    } else if (setType === "READING") {
        const { ReadingTest } = await import("../reading/reading.model");
        const testDoc = await ReadingTest.findOne({ testNumber: setNumber }).lean();
        const test = testDoc as any; // Cast to any to access dynamic properties

        console.log(`[getQuestionTextsFromSet] READING test found:`, !!test);
        console.log(`[getQuestionTextsFromSet] Test keys:`, test ? Object.keys(test).filter((k: string) => !k.startsWith('_')) : []);

        // Reading tests can have either 'sections' or 'passages' structure
        const passagesOrSections = test?.passages || test?.sections;
        console.log(`[getQuestionTextsFromSet] passagesOrSections count:`, passagesOrSections?.length || 0);

        if (passagesOrSections) {
            passagesOrSections.forEach((passage: any, pIdx: number) => {

                // Check for questions directly on passage/section
                passage.questions?.forEach((q: any) => {
                    questionData[q.questionNumber] = {
                        questionText: q.questionText || "",
                        correctAnswer: q.correctAnswer || ""
                    };
                });

                // For Reading tests, questions are typically inside questionGroups
                passage.questionGroups?.forEach((group: any) => {
                    // Questions are directly in questionGroups[].questions[] array
                    group.questions?.forEach((q: any) => {
                        questionData[q.questionNumber] = {
                            questionText: q.questionText || "",
                            correctAnswer: q.correctAnswer || ""
                        };
                    });

                    // Also check for nested structures just in case
                    // note-completion: notesSections with bullets
                    if (group.notesSections) {
                        group.notesSections.forEach((noteSection: any) => {
                            noteSection.bullets?.forEach((bullet: any) => {
                                if (bullet.questionNumber && bullet.type !== "context") {
                                    questionData[bullet.questionNumber] = {
                                        questionText: bullet.textBefore || group.mainInstruction || `Question ${bullet.questionNumber}`,
                                        correctAnswer: bullet.correctAnswer || ""
                                    };
                                }
                            });
                        });
                    }

                    // statements array (true-false-not-given, yes-no-not-given)
                    if (group.statements) {
                        group.statements.forEach((stmt: any) => {
                            questionData[stmt.questionNumber] = {
                                questionText: stmt.text || `Question ${stmt.questionNumber}`,
                                correctAnswer: stmt.correctAnswer || ""
                            };
                        });
                    }

                    // matchingItems array
                    if (group.matchingItems) {
                        group.matchingItems.forEach((item: any) => {
                            questionData[item.questionNumber] = {
                                questionText: item.text || `Question ${item.questionNumber}`,
                                correctAnswer: item.correctAnswer || ""
                            };
                        });
                    }

                    // summarySegments
                    if (group.summarySegments) {
                        group.summarySegments.forEach((segment: any) => {
                            if (segment.type === "blank" && segment.questionNumber) {
                                questionData[segment.questionNumber] = {
                                    questionText: segment.content || group.mainHeading || `Question ${segment.questionNumber}`,
                                    correctAnswer: segment.correctAnswer || ""
                                };
                            }
                        });
                    }

                    // questionSets (choose-two-letters)
                    if (group.questionSets) {
                        group.questionSets.forEach((qSet: any) => {
                            qSet.questionNumbers?.forEach((qNum: number, idx: number) => {
                                const correctAnswers = qSet.correctAnswers || [];
                                questionData[qNum] = {
                                    questionText: qSet.questionText || `Question ${qNum}`,
                                    correctAnswer: correctAnswers[idx] || ""
                                };
                            });
                        });
                    }

                    // mcQuestions (multiple-choice-full)
                    if (group.mcQuestions) {
                        group.mcQuestions.forEach((mcQ: any) => {
                            questionData[mcQ.questionNumber] = {
                                questionText: mcQ.questionText || `Question ${mcQ.questionNumber}`,
                                correctAnswer: mcQ.correctAnswer || ""
                            };
                        });
                    }
                });
            });
        }
    }

    console.log(`[getQuestionTextsFromSet] ${setType} Set ${setNumber}: Found ${Object.keys(questionData).length} questions`);
    return questionData;
};



// Update all scores at once (admin) - for comprehensive score editing
const updateAllScores = async (
    studentId: string,
    scoresData: {
        listening?: { band: number; correctAnswers?: number };
        reading?: { band: number; correctAnswers?: number };
        writing?: { task1Band: number; task2Band: number; overallBand: number };
        adminRemarks?: string;
    }
) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Student not found");
    }

    if (!student.scores) {
        student.scores = {
            listening: { raw: 0, band: 0, correctAnswers: 0, totalQuestions: 40 },
            reading: { raw: 0, band: 0, correctAnswers: 0, totalQuestions: 40 },
            writing: { task1Band: 0, task2Band: 0, overallBand: 0 },
            overall: 0,
        };
    }

    // Update listening scores
    if (scoresData.listening) {
        student.scores.listening.band = scoresData.listening.band;
        if (scoresData.listening.correctAnswers !== undefined) {
            student.scores.listening.correctAnswers = scoresData.listening.correctAnswers;
            student.scores.listening.raw = scoresData.listening.correctAnswers;
        }
    }

    // Update reading scores
    if (scoresData.reading) {
        student.scores.reading.band = scoresData.reading.band;
        if (scoresData.reading.correctAnswers !== undefined) {
            student.scores.reading.correctAnswers = scoresData.reading.correctAnswers;
            student.scores.reading.raw = scoresData.reading.correctAnswers;
        }
    }

    // Update writing scores
    if (scoresData.writing) {
        student.scores.writing.task1Band = scoresData.writing.task1Band;
        student.scores.writing.task2Band = scoresData.writing.task2Band;
        student.scores.writing.overallBand = scoresData.writing.overallBand;
    }

    // Update admin remarks
    if (scoresData.adminRemarks !== undefined) {
        student.adminRemarks = scoresData.adminRemarks;
    }

    // Recalculate overall band score
    const listening = student.scores.listening?.band || 0;
    const reading = student.scores.reading?.band || 0;
    const writing = student.scores.writing?.overallBand || 0;

    const bands = [listening, reading, writing].filter(b => b > 0);
    if (bands.length > 0) {
        const sum = bands.reduce((a, b) => a + b, 0);
        student.scores.overall = Math.round((sum / bands.length) * 2) / 2; // Round to nearest 0.5
    }

    await student.save();

    return student;
};

// Publish results for student (admin)
const publishResults = async (studentId: string, publish: boolean = true) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Student not found");
    }

    student.resultsPublished = publish;

    // If publishing, ensure exam status is completed
    if (publish && student.examStatus !== "completed") {
        student.examStatus = "completed";
        if (!student.examCompletedAt) {
            student.examCompletedAt = new Date();
        }
    }

    await student.save();

    return {
        _id: student._id,
        examId: student.examId,
        nameEnglish: student.nameEnglish,
        resultsPublished: student.resultsPublished,
        scores: student.scores,
        message: publish ? "Results published successfully" : "Results unpublished",
    };
};

// Reset individual module (admin only)
const resetModule = async (
    studentId: string,
    module: "listening" | "reading" | "writing"
) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Student not found");
    }

    const completedModules = student.completedModules || [];

    // Check if module is completed
    if (!completedModules.includes(module)) {
        throw new Error(`${module} module is not completed yet`);
    }

    // Build update object to remove module data
    const updateObj: Record<string, any> = {};
    const unsetObj: Record<string, any> = {};

    // Remove module from completedModules
    const newCompletedModules = completedModules.filter(m => m !== module);
    updateObj.completedModules = newCompletedModules;

    // Clear module score and answers using $unset
    unsetObj[`scores.${module}`] = "";
    unsetObj[`examAnswers.${module}`] = "";

    // Update exam status
    if (newCompletedModules.length === 0) {
        updateObj.examStatus = "not-started";
    } else if (newCompletedModules.length < 3) {
        updateObj.examStatus = "in-progress";
    }

    // Recalculate overall band from remaining modules
    const existingScores = student.scores || {} as any;
    const listeningBand = module === "listening" ? 0 : (existingScores.listening?.band || 0);
    const readingBand = module === "reading" ? 0 : (existingScores.reading?.band || 0);
    const writingBand = module === "writing" ? 0 : (existingScores.writing?.overallBand || 0);

    const bands = [listeningBand, readingBand, writingBand].filter(b => b > 0);
    if (bands.length > 0) {
        const sum = bands.reduce((a, b) => a + b, 0);
        updateObj["scores.overall"] = Math.round((sum / bands.length) * 2) / 2;
    } else {
        unsetObj["scores.overall"] = "";
    }

    // Perform update
    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        {
            $set: updateObj,
            $unset: unsetObj
        },
        { new: true }
    );

    if (!updatedStudent) {
        throw new Error("Failed to reset module");
    }

    return {
        _id: updatedStudent._id,
        examId: updatedStudent.examId,
        nameEnglish: updatedStudent.nameEnglish,
        module,
        completedModules: updatedStudent.completedModules,
        examStatus: updatedStudent.examStatus,
        scores: updatedStudent.scores,
        message: `${module} module reset successfully. Student can now retake this module.`,
    };
};

const getStudentByEmail = async (email: string) => {
    const student = await Student.findOne({ email });
    if (!student) {
        throw new Error("Student not found");
    }
    return student;
};

export const StudentService = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentByExamId,
    getStudentByEmail,
    updateStudent,
    deleteStudent,
    verifyExamId,
    startExam,
    reportViolation,
    resetExam,
    completeExam,
    saveModuleScore,
    getExamResults,
    getAllResults,
    getStatistics,
    updateScore,
    getAnswerSheet,
    updateAllScores,
    publishResults,
    resetModule,
};
