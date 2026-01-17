import { Exam } from "./exam.model";
import { IExam } from "./exam.interface";

// Generate Exam ID: BACIELTS250001
const generateExamId = async (): Promise<string> => {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `BACIELTS${year}`;

    // Get count of existing exams this year
    const count = await Exam.countDocuments({
        examId: { $regex: `^${prefix}` },
    });

    const sequentialNumber = (count + 1).toString().padStart(5, "0");
    return `${prefix}${sequentialNumber}`;
};

const createExam = async (examData: Partial<IExam>, userId: string) => {
    const examId = await generateExamId();

    const exam = await Exam.create({
        ...examData,
        examId,
        createdBy: userId,
    });

    return exam;
};

const getAllExams = async (query: any = {}) => {
    const filter: any = {};

    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }

    const exams = await Exam.find(filter)
        .select("-listening.sections.questions.correctAnswer -reading.sections.questions.correctAnswer")
        .sort({ createdAt: -1 });

    return exams;
};

const getExamById = async (examId: string, includeAnswers: boolean = false) => {
    let query = Exam.findOne({ examId });

    if (!includeAnswers) {
        query = query.select(
            "-listening.sections.questions.correctAnswer -reading.sections.questions.correctAnswer"
        );
    }

    const exam = await query;

    if (!exam) {
        throw new Error("Exam not found");
    }

    return exam;
};

const getExamWithAnswers = async (examId: string) => {
    const exam = await Exam.findOne({ examId });

    if (!exam) {
        throw new Error("Exam not found");
    }

    return exam;
};

const updateExam = async (examId: string, updateData: Partial<IExam>) => {
    const exam = await Exam.findOneAndUpdate(
        { examId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!exam) {
        throw new Error("Exam not found");
    }

    return exam;
};

const deleteExam = async (examId: string) => {
    const exam = await Exam.findOneAndDelete({ examId });

    if (!exam) {
        throw new Error("Exam not found");
    }

    return exam;
};

export const ExamService = {
    createExam,
    getAllExams,
    getExamById,
    getExamWithAnswers,
    updateExam,
    deleteExam,
};
