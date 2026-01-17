"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const student_model_1 = require("./student.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = require("mongoose");
// Generate unique exam ID
const generateExamId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `BACIELTS${currentYear}`;
    const lastStudent = yield student_model_1.Student.findOne({
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
});
// Create new student with auto ID generation
const createStudent = (data, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email already exists
    const existingStudent = yield student_model_1.Student.findOne({ email: data.email });
    if (existingStudent) {
        throw new Error("A student with this email already exists");
    }
    // Check if phone already exists
    const existingPhone = yield student_model_1.Student.findOne({ phone: data.phone });
    if (existingPhone) {
        throw new Error("A student with this phone number already exists");
    }
    // Generate unique exam ID
    const examId = yield generateExamId();
    // Auto-generate password (using phone number)
    const autoPassword = data.phone;
    // Create student
    const student = yield student_model_1.Student.create(Object.assign(Object.assign({}, data), { examId, password: autoPassword, examDate: new Date(data.examDate), paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined, assignedSets: {
            listeningSetNumber: data.listeningSetNumber,
            readingSetNumber: data.readingSetNumber,
            writingSetNumber: data.writingSetNumber,
        }, createdBy: new mongoose_1.Types.ObjectId(adminId) }));
    // Also create a user account for student dashboard access
    const userExists = yield user_model_1.User.findOne({ email: data.email });
    if (!userExists) {
        const user = yield user_model_1.User.create({
            name: data.nameEnglish,
            email: data.email,
            phone: data.phone,
            nid: data.nidNumber,
            password: autoPassword,
            role: "user",
        });
        // Link user to student
        student.userId = user._id;
        yield student.save();
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
});
// Get all students with filters and pagination
const getAllStudents = (filters, page = 1, limit = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
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
            query.examDate.$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
            query.examDate.$lte = new Date(filters.toDate);
        }
    }
    const skip = (page - 1) * limit;
    const [students, total] = yield Promise.all([
        student_model_1.Student.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        student_model_1.Student.countDocuments(query),
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
});
// Get student by ID
const getStudentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findById(id)
        .select("-password")
        .populate("createdBy", "name email")
        .lean();
    if (!student) {
        throw new Error("Student not found");
    }
    return student;
});
// Get student by exam ID
const getStudentByExamId = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() })
        .select("-password")
        .lean();
    if (!student) {
        throw new Error("Student not found with this Exam ID");
    }
    return student;
});
// Update student
const updateStudent = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findById(id);
    if (!student) {
        throw new Error("Student not found");
    }
    // Build update object
    const updateObj = Object.assign({}, updateData);
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
    const updatedStudent = yield student_model_1.Student.findByIdAndUpdate(id, { $set: updateObj }, { new: true, runValidators: true }).select("-password");
    return updatedStudent;
});
// Delete student
const deleteStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findById(id);
    if (!student) {
        throw new Error("Student not found");
    }
    // Also delete associated user account
    if (student.userId) {
        yield user_model_1.User.findByIdAndDelete(student.userId);
    }
    yield student_model_1.Student.findByIdAndDelete(id);
    return { message: "Student deleted successfully" };
});
// Verify exam ID for exam start
const verifyExamId = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() })
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
});
// Start exam session
const startExam = (examId, ipAddress, browserFingerprint) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() });
    if (!student) {
        throw new Error("Student not found");
    }
    // Check verification
    const verification = yield verifyExamId(examId);
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
    yield student.save();
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
});
// Report violation
const reportViolation = (examId, violationType) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() });
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
    let action = "warning";
    // Dev tools = immediate termination
    if (violationType === "dev-tools") {
        action = "terminated";
    }
    else if (violationCount >= 3) {
        action = "terminated";
    }
    else if (violationCount === 2) {
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
    yield student.save();
    return {
        action,
        violationCount,
        totalViolations: student.totalViolations,
        examTerminated: action === "terminated",
    };
});
// Reset exam (admin only)
const resetExam = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() });
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
    yield student.save();
    return {
        message: "Exam reset successfully",
        examId: student.examId,
        canRetake: true,
    };
});
// Complete exam and save scores
const completeExam = (examId, scores) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() });
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
    const examScores = {};
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
        const listeningBand = examScores.listening.band || 0;
        const readingBand = examScores.reading.band || 0;
        const writingBand = ((_a = examScores.writing) === null || _a === void 0 ? void 0 : _a.overallBand) || 0;
        // If writing exists, average all three; otherwise just L+R
        if (writingBand > 0) {
            examScores.overall = Math.round(((listeningBand + readingBand + writingBand) / 3) * 2) / 2;
        }
        else {
            examScores.overall = Math.round(((listeningBand + readingBand) / 2) * 2) / 2;
        }
    }
    // Update student record
    student.scores = examScores;
    student.examStatus = "completed";
    student.examCompletedAt = new Date();
    yield student.save();
    return {
        examId: student.examId,
        name: student.nameEnglish,
        status: student.examStatus,
        completedAt: student.examCompletedAt,
        scores: student.scores,
    };
});
// Save individual module score
const saveModuleScore = (examId, module, scoreData) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g;
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() });
    if (!student) {
        throw new Error("Student not found");
    }
    // Initialize scores object if not exists
    if (!student.scores) {
        student.scores = {};
    }
    // Initialize completedModules array if not exists
    if (!student.completedModules) {
        student.completedModules = [];
    }
    // Check if module already completed
    if (student.completedModules.includes(module)) {
        throw new Error(`${module} exam has already been completed`);
    }
    // Save module-specific score
    if (module === "listening") {
        student.scores.listening = {
            raw: scoreData.score || 0,
            band: scoreData.band,
            correctAnswers: scoreData.score || 0,
            totalQuestions: scoreData.total || 40,
        };
    }
    else if (module === "reading") {
        student.scores.reading = {
            raw: scoreData.score || 0,
            band: scoreData.band,
            correctAnswers: scoreData.score || 0,
            totalQuestions: scoreData.total || 40,
        };
    }
    else if (module === "writing") {
        student.scores.writing = {
            task1Band: scoreData.band,
            task2Band: scoreData.band,
            overallBand: scoreData.band,
        };
    }
    // Add to completed modules
    student.completedModules.push(module);
    // Calculate overall band if all modules completed
    const hasListening = (_c = (_b = student.scores) === null || _b === void 0 ? void 0 : _b.listening) === null || _c === void 0 ? void 0 : _c.band;
    const hasReading = (_e = (_d = student.scores) === null || _d === void 0 ? void 0 : _d.reading) === null || _e === void 0 ? void 0 : _e.band;
    const hasWriting = (_g = (_f = student.scores) === null || _f === void 0 ? void 0 : _f.writing) === null || _g === void 0 ? void 0 : _g.overallBand;
    if (hasListening && hasReading && hasWriting) {
        const listeningBand = student.scores.listening.band;
        const readingBand = student.scores.reading.band;
        const writingBand = student.scores.writing.overallBand;
        student.scores.overall = Math.round(((listeningBand + readingBand + writingBand) / 3) * 2) / 2;
        // Mark exam as completed when all modules done
        student.examStatus = "completed";
        student.examCompletedAt = new Date();
    }
    else {
        // Keep in-progress status
        student.examStatus = "in-progress";
    }
    yield student.save();
    return {
        examId: student.examId,
        module,
        band: scoreData.band,
        completedModules: student.completedModules,
        allCompleted: student.completedModules.length === 3,
        scores: student.scores,
    };
});
// Get exam results for a student
const getExamResults = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ examId: examId.toUpperCase() })
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
});
// Get all results (admin)
const getAllResults = (filters, page = 1, limit = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
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
            query.examCompletedAt.$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
            query.examCompletedAt.$lte = new Date(filters.toDate);
        }
    }
    const skip = (page - 1) * limit;
    const [results, total] = yield Promise.all([
        student_model_1.Student.find(query)
            .select("examId nameEnglish email examStatus examCompletedAt scores totalViolations completedModules")
            .sort({ examCompletedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        student_model_1.Student.countDocuments(query),
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
});
// Get statistics (admin dashboard)
const getStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalStudents, pendingPayments, paidPayments, notStarted, inProgress, completed, terminated,] = yield Promise.all([
        student_model_1.Student.countDocuments({}),
        student_model_1.Student.countDocuments({ paymentStatus: "pending" }),
        student_model_1.Student.countDocuments({ paymentStatus: "paid" }),
        student_model_1.Student.countDocuments({ examStatus: "not-started" }),
        student_model_1.Student.countDocuments({ examStatus: "in-progress" }),
        student_model_1.Student.countDocuments({ examStatus: "completed" }),
        student_model_1.Student.countDocuments({ examStatus: "terminated" }),
    ]);
    // Get average scores
    const avgScores = yield student_model_1.Student.aggregate([
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
    const todayExams = yield student_model_1.Student.countDocuments({
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
});
exports.StudentService = {
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
};
