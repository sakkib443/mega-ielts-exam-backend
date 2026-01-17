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
exports.ExamSessionService = void 0;
const examSession_model_1 = require("./examSession.model");
const exam_model_1 = require("../exam/exam.model");
const autoMarking_service_1 = require("./autoMarking.service");
// Generate session ID: BACIELTS250001
const generateSessionId = () => __awaiter(void 0, void 0, void 0, function* () {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `BACIELTS${year}`;
    // Get count of existing sessions this year
    const count = yield examSession_model_1.ExamSession.countDocuments({
        sessionId: { $regex: `^${prefix}` },
    });
    const sequentialNumber = (count + 1).toString().padStart(5, "0");
    return `${prefix}${sequentialNumber}`;
});
// Start a new exam session
const startExam = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { examId, name, phone, nid } = data;
    // Find the exam
    const exam = yield exam_model_1.Exam.findOne({ examId, isActive: true });
    if (!exam) {
        throw new Error("Exam not found or not active");
    }
    // Check if user already has an active session for this exam
    const existingSession = yield examSession_model_1.ExamSession.findOne({
        examId,
        "user.nid": nid,
        status: { $ne: "completed" },
    });
    if (existingSession) {
        return {
            session: existingSession,
            message: "Existing session found. Resuming...",
        };
    }
    // Create new session
    const sessionId = yield generateSessionId();
    const session = yield examSession_model_1.ExamSession.create({
        sessionId,
        examId,
        exam: exam._id,
        user: { name, phone, nid },
        status: "in-progress",
        currentSection: "listening",
        startedAt: new Date(),
    });
    return {
        session,
        message: "Exam session started successfully",
    };
});
// Get session by ID
const getSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield examSession_model_1.ExamSession.findOne({ sessionId }).populate({
        path: "exam",
        select: "-listening.sections.questions.correctAnswer -reading.sections.questions.correctAnswer",
    });
    if (!session) {
        throw new Error("Session not found");
    }
    return session;
});
// Submit answers for a section
const submitAnswers = (sessionId, section, answers) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield examSession_model_1.ExamSession.findOne({ sessionId });
    if (!session) {
        throw new Error("Session not found");
    }
    if (session.status === "completed") {
        throw new Error("This exam session has already been completed");
    }
    const exam = yield exam_model_1.Exam.findById(session.exam);
    if (!exam) {
        throw new Error("Exam not found");
    }
    // Update answers based on section
    if (section === "listening" || section === "reading") {
        const answersArray = answers;
        session.answers[section] = answersArray;
        // Auto-mark the section
        const rawScore = autoMarking_service_1.AutoMarkingService.calculateSectionScore(answersArray, exam[section].sections);
        const bandScore = autoMarking_service_1.AutoMarkingService.convertToBandScore(rawScore);
        session.scores[section] = {
            raw: rawScore,
            band: bandScore,
        };
        // Move to next section
        if (section === "listening") {
            session.currentSection = "reading";
        }
        else if (section === "reading") {
            session.currentSection = "writing";
        }
    }
    else if (section === "writing") {
        const writingAnswers = answers;
        session.answers.writing = {
            task1: writingAnswers.task1 || "",
            task2: writingAnswers.task2 || "",
        };
        session.currentSection = "completed";
        session.status = "completed";
        session.completedAt = new Date();
        // Calculate overall band (without writing since it needs manual marking)
        const listeningBand = session.scores.listening.band;
        const readingBand = session.scores.reading.band;
        session.scores.overall = autoMarking_service_1.AutoMarkingService.calculateOverallBand([
            listeningBand,
            readingBand,
        ]);
    }
    yield session.save();
    return session;
});
// Get session result
const getResult = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield examSession_model_1.ExamSession.findOne({ sessionId }).select("sessionId examId user scores status currentSection startedAt completedAt");
    if (!session) {
        throw new Error("Session not found");
    }
    return session;
});
// Get all sessions (admin)
const getAllSessions = (query = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (query.status) {
        filter.status = query.status;
    }
    if (query.examId) {
        filter.examId = query.examId;
    }
    const sessions = yield examSession_model_1.ExamSession.find(filter)
        .select("sessionId examId user scores status startedAt completedAt createdAt")
        .sort({ createdAt: -1 });
    return sessions;
});
// Update writing scores (admin manual marking)
const updateWritingScores = (sessionId, task1Band, task2Band) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield examSession_model_1.ExamSession.findOne({ sessionId });
    if (!session) {
        throw new Error("Session not found");
    }
    // Calculate writing overall (Task 2 is worth double Task 1)
    const writingOverall = (task1Band + task2Band * 2) / 3;
    const roundedWritingBand = Math.round(writingOverall * 2) / 2;
    session.scores.writing = {
        task1Band,
        task2Band,
        overallBand: roundedWritingBand,
    };
    // Recalculate overall band including writing
    session.scores.overall = autoMarking_service_1.AutoMarkingService.calculateOverallBand([
        session.scores.listening.band,
        session.scores.reading.band,
        roundedWritingBand,
    ]);
    yield session.save();
    return session;
});
exports.ExamSessionService = {
    startExam,
    getSession,
    submitAnswers,
    getResult,
    getAllSessions,
    updateWritingScores,
};
