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
exports.ExamService = void 0;
const exam_model_1 = require("./exam.model");
// Generate Exam ID: BACIELTS250001
const generateExamId = () => __awaiter(void 0, void 0, void 0, function* () {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `BACIELTS${year}`;
    // Get count of existing exams this year
    const count = yield exam_model_1.Exam.countDocuments({
        examId: { $regex: `^${prefix}` },
    });
    const sequentialNumber = (count + 1).toString().padStart(5, "0");
    return `${prefix}${sequentialNumber}`;
});
const createExam = (examData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const examId = yield generateExamId();
    const exam = yield exam_model_1.Exam.create(Object.assign(Object.assign({}, examData), { examId, createdBy: userId }));
    return exam;
});
const getAllExams = (query = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }
    const exams = yield exam_model_1.Exam.find(filter)
        .select("-listening.sections.questions.correctAnswer -reading.sections.questions.correctAnswer")
        .sort({ createdAt: -1 });
    return exams;
});
const getExamById = (examId, includeAnswers = false) => __awaiter(void 0, void 0, void 0, function* () {
    let query = exam_model_1.Exam.findOne({ examId });
    if (!includeAnswers) {
        query = query.select("-listening.sections.questions.correctAnswer -reading.sections.questions.correctAnswer");
    }
    const exam = yield query;
    if (!exam) {
        throw new Error("Exam not found");
    }
    return exam;
});
const getExamWithAnswers = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    const exam = yield exam_model_1.Exam.findOne({ examId });
    if (!exam) {
        throw new Error("Exam not found");
    }
    return exam;
});
const updateExam = (examId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const exam = yield exam_model_1.Exam.findOneAndUpdate({ examId }, updateData, { new: true, runValidators: true });
    if (!exam) {
        throw new Error("Exam not found");
    }
    return exam;
});
const deleteExam = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    const exam = yield exam_model_1.Exam.findOneAndDelete({ examId });
    if (!exam) {
        throw new Error("Exam not found");
    }
    return exam;
});
exports.ExamService = {
    createExam,
    getAllExams,
    getExamById,
    getExamWithAnswers,
    updateExam,
    deleteExam,
};
