import { Student } from "./student.model";
import { User } from "../user/user.model";
import { ICreateStudentInput, IStudentFilters, ExamStatus } from "./student.interface";
import { Types } from "mongoose";

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
        return { valid: false, message: "You have already completed this exam" };
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
        answers?: any; // Added answers field
    }
) => {
    const student = await Student.findOne({ examId: examId.toUpperCase() });

    if (!student) {
        throw new Error("Student not found");
    }

    // Initialize objects if they don't exist
    if (!student.scores) student.scores = {} as any;
    if (!student.completedModules) student.completedModules = [];
    if (!student.examAnswers) student.examAnswers = {};

    // Check if module already completed
    if (student.completedModules.includes(module)) {
        throw new Error(`${module} exam has already been completed`);
    }

    // Save module-specific score and answers
    if (module === "listening") {
        student.scores!.listening = {
            raw: scoreData.score || 0,
            band: scoreData.band,
            correctAnswers: scoreData.score || 0,
            totalQuestions: scoreData.total || 40,
        };
        if (scoreData.answers) student.examAnswers.listening = scoreData.answers;
    } else if (module === "reading") {
        student.scores!.reading = {
            raw: scoreData.score || 0,
            band: scoreData.band,
            correctAnswers: scoreData.score || 0,
            totalQuestions: scoreData.total || 40,
        };
        if (scoreData.answers) student.examAnswers.reading = scoreData.answers;
    } else if (module === "writing") {
        student.scores!.writing = {
            task1Band: scoreData.band,
            task2Band: scoreData.band,
            overallBand: scoreData.band,
        };
        if (scoreData.answers) {
            student.examAnswers.writing = {
                task1: scoreData.answers.task1 || "",
                task2: scoreData.answers.task2 || "",
            };
        }
    }

    // Add to completed modules
    student.completedModules.push(module);

    // Calculate overall band if enough modules done
    const listeningBand = student.scores?.listening?.band || 0;
    const readingBand = student.scores?.reading?.band || 0;
    const writingBand = student.scores?.writing?.overallBand || 0;

    if (listeningBand > 0 || readingBand > 0 || writingBand > 0) {
        const bands = [listeningBand, readingBand, writingBand].filter(b => b > 0);
        const sum = bands.reduce((a, b) => a + b, 0);
        student.scores.overall = Math.round((sum / bands.length) * 2) / 2;
    }

    // Update exam status
    if (student.completedModules.length >= 3) {
        student.examStatus = "completed";
        student.examCompletedAt = new Date();
    } else {
        student.examStatus = "in-progress";
    }

    await student.save();

    return {
        examId: student.examId,
        module,
        band: scoreData.band,
        completedModules: student.completedModules,
        allCompleted: student.completedModules.length === 3,
        scores: student.scores,
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
    const answers = student.examAnswers?.[moduleName as keyof typeof student.examAnswers] || [];

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

export const StudentService = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentByExamId,
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
};
