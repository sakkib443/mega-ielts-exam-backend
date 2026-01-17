import { ExamSession } from "./examSession.model";
import { Exam } from "../exam/exam.model";
import { IExamUser, IAnswer } from "./examSession.interface";
import { AutoMarkingService } from "./autoMarking.service";

// Generate session ID: BACIELTS250001
const generateSessionId = async (): Promise<string> => {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `BACIELTS${year}`;

    // Get count of existing sessions this year
    const count = await ExamSession.countDocuments({
        sessionId: { $regex: `^${prefix}` },
    });

    const sequentialNumber = (count + 1).toString().padStart(5, "0");
    return `${prefix}${sequentialNumber}`;
};

// Start a new exam session
const startExam = async (data: { examId: string } & IExamUser) => {
    const { examId, name, phone, nid } = data;

    // Find the exam
    const exam = await Exam.findOne({ examId, isActive: true });
    if (!exam) {
        throw new Error("Exam not found or not active");
    }

    // Check if user already has an active session for this exam
    const existingSession = await ExamSession.findOne({
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
    const sessionId = await generateSessionId();
    const session = await ExamSession.create({
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
};

// Get session by ID
const getSession = async (sessionId: string) => {
    const session = await ExamSession.findOne({ sessionId }).populate({
        path: "exam",
        select:
            "-listening.sections.questions.correctAnswer -reading.sections.questions.correctAnswer",
    });

    if (!session) {
        throw new Error("Session not found");
    }

    return session;
};

// Submit answers for a section
const submitAnswers = async (
    sessionId: string,
    section: "listening" | "reading" | "writing",
    answers: IAnswer[] | { task1?: string; task2?: string }
) => {
    const session = await ExamSession.findOne({ sessionId });
    if (!session) {
        throw new Error("Session not found");
    }

    if (session.status === "completed") {
        throw new Error("This exam session has already been completed");
    }

    const exam = await Exam.findById(session.exam);
    if (!exam) {
        throw new Error("Exam not found");
    }

    // Update answers based on section
    if (section === "listening" || section === "reading") {
        const answersArray = answers as IAnswer[];
        session.answers[section] = answersArray;

        // Auto-mark the section
        const rawScore = AutoMarkingService.calculateSectionScore(
            answersArray,
            exam[section].sections
        );
        const bandScore = AutoMarkingService.convertToBandScore(rawScore);

        session.scores[section] = {
            raw: rawScore,
            band: bandScore,
        };

        // Move to next section
        if (section === "listening") {
            session.currentSection = "reading";
        } else if (section === "reading") {
            session.currentSection = "writing";
        }
    } else if (section === "writing") {
        const writingAnswers = answers as { task1?: string; task2?: string };
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
        session.scores.overall = AutoMarkingService.calculateOverallBand([
            listeningBand,
            readingBand,
        ]);
    }

    await session.save();

    return session;
};

// Get session result
const getResult = async (sessionId: string) => {
    const session = await ExamSession.findOne({ sessionId }).select(
        "sessionId examId user scores status currentSection startedAt completedAt"
    );

    if (!session) {
        throw new Error("Session not found");
    }

    return session;
};

// Get all sessions (admin)
const getAllSessions = async (query: any = {}) => {
    const filter: any = {};

    if (query.status) {
        filter.status = query.status;
    }

    if (query.examId) {
        filter.examId = query.examId;
    }

    const sessions = await ExamSession.find(filter)
        .select(
            "sessionId examId user scores status startedAt completedAt createdAt"
        )
        .sort({ createdAt: -1 });

    return sessions;
};

// Update writing scores (admin manual marking)
const updateWritingScores = async (
    sessionId: string,
    task1Band: number,
    task2Band: number
) => {
    const session = await ExamSession.findOne({ sessionId });
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
    session.scores.overall = AutoMarkingService.calculateOverallBand([
        session.scores.listening.band,
        session.scores.reading.band,
        roundedWritingBand,
    ]);

    await session.save();

    return session;
};

export const ExamSessionService = {
    startExam,
    getSession,
    submitAnswers,
    getResult,
    getAllSessions,
    updateWritingScores,
};
