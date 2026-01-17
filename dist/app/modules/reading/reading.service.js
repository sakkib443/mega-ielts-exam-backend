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
exports.ReadingService = void 0;
const mongoose_1 = require("mongoose");
const reading_model_1 = require("./reading.model");
const reading_interface_1 = require("./reading.interface");
// Create new reading test
const createReadingTest = (data, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const { testId, testNumber } = yield (0, reading_model_1.generateReadingTestId)();
    // Calculate total questions
    let totalQuestions = 0;
    let totalMarks = 0;
    if (data.sections && data.sections.length > 0) {
        data.sections.forEach((section) => {
            totalQuestions += section.questions.length;
            section.questions.forEach((q) => {
                totalMarks += q.marks || 1;
            });
        });
    }
    const readingTest = yield reading_model_1.ReadingTest.create(Object.assign(Object.assign({}, data), { testId,
        testNumber,
        totalQuestions,
        totalMarks, createdBy: new mongoose_1.Types.ObjectId(adminId) }));
    return readingTest;
});
// Get all reading tests
const getAllReadingTests = (filters, page = 1, limit = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (filters.testType) {
        query.testType = filters.testType;
    }
    if (filters.difficulty) {
        query.difficulty = filters.difficulty;
    }
    if (typeof filters.isActive === "boolean") {
        query.isActive = filters.isActive;
    }
    if (filters.searchTerm) {
        query.$or = [
            { title: { $regex: filters.searchTerm, $options: "i" } },
            { testId: { $regex: filters.searchTerm, $options: "i" } },
            { source: { $regex: filters.searchTerm, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [tests, total] = yield Promise.all([
        reading_model_1.ReadingTest.find(query)
            .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
            .sort({ testNumber: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        reading_model_1.ReadingTest.countDocuments(query),
    ]);
    return {
        tests,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
// Get reading test by ID
const getReadingTestById = (id, includeAnswers = false) => __awaiter(void 0, void 0, void 0, function* () {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";
    const test = selectFields
        ? yield reading_model_1.ReadingTest.findById(id).select(selectFields).lean()
        : yield reading_model_1.ReadingTest.findById(id).lean();
    if (!test) {
        throw new Error("Reading test not found");
    }
    return test;
});
// Get reading test by number
const getReadingTestByNumber = (testNumber, includeAnswers = false) => __awaiter(void 0, void 0, void 0, function* () {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";
    const test = selectFields
        ? yield reading_model_1.ReadingTest.findOne({ testNumber, isActive: true }).select(selectFields).lean()
        : yield reading_model_1.ReadingTest.findOne({ testNumber, isActive: true }).lean();
    if (!test) {
        throw new Error(`Reading Test #${testNumber} not found`);
    }
    yield reading_model_1.ReadingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
    return test;
});
// Get reading test for exam
const getReadingTestForExam = (testNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield reading_model_1.ReadingTest.findOne({ testNumber, isActive: true })
        .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
        .lean();
    if (!test) {
        throw new Error(`Reading Test #${testNumber} not found or inactive`);
    }
    return test;
});
// Get answers for grading
const getAnswersForGrading = (testNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield reading_model_1.ReadingTest.findOne({ testNumber })
        .select("sections.questions.questionNumber sections.questions.correctAnswer sections.questions.acceptableAnswers testType")
        .lean();
    if (!test) {
        throw new Error("Reading test not found");
    }
    const answerMap = {};
    if (test.sections) {
        test.sections.forEach((section) => {
            section.questions.forEach((q) => {
                answerMap[q.questionNumber] = {
                    correct: q.correctAnswer,
                    acceptable: q.acceptableAnswers
                };
            });
        });
    }
    return { answerMap, testType: test.testType };
});
// Grade reading answers
const gradeReadingAnswers = (testNumber, studentAnswers) => __awaiter(void 0, void 0, void 0, function* () {
    const { answerMap, testType } = yield getAnswersForGrading(testNumber);
    let correctCount = 0;
    const results = {};
    for (const [questionNum, studentAnswer] of Object.entries(studentAnswers)) {
        const qNum = parseInt(questionNum);
        const correctData = answerMap[qNum];
        if (!correctData)
            continue;
        const normalizeAnswer = (ans) => ans === null || ans === void 0 ? void 0 : ans.toLowerCase().trim().replace(/[.,!?]/g, "");
        const studentNormalized = normalizeAnswer(studentAnswer);
        let isCorrect = false;
        if (Array.isArray(correctData.correct)) {
            isCorrect = correctData.correct.some(ca => normalizeAnswer(ca) === studentNormalized);
        }
        else {
            isCorrect = normalizeAnswer(correctData.correct) === studentNormalized;
        }
        if (!isCorrect && correctData.acceptable) {
            isCorrect = correctData.acceptable.some(aa => normalizeAnswer(aa) === studentNormalized);
        }
        if (isCorrect)
            correctCount++;
        results[qNum] = {
            studentAnswer,
            correctAnswer: correctData.correct,
            isCorrect
        };
    }
    const bandScore = (0, reading_interface_1.getReadingBandScore)(correctCount, testType);
    return {
        correctCount,
        totalQuestions: Object.keys(answerMap).length,
        bandScore,
        testType,
        results
    };
});
// Update reading test
const updateReadingTest = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield reading_model_1.ReadingTest.findById(id);
    if (!test) {
        throw new Error("Reading test not found");
    }
    if (updateData.sections) {
        let totalQuestions = 0;
        let totalMarks = 0;
        updateData.sections.forEach((section) => {
            totalQuestions += section.questions.length;
            section.questions.forEach((q) => {
                totalMarks += q.marks || 1;
            });
        });
        updateData.totalQuestions = totalQuestions;
        updateData.totalMarks = totalMarks;
    }
    const updatedTest = yield reading_model_1.ReadingTest.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    return updatedTest;
});
// Delete reading test
const deleteReadingTest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield reading_model_1.ReadingTest.findById(id);
    if (!test) {
        throw new Error("Reading test not found");
    }
    yield reading_model_1.ReadingTest.findByIdAndUpdate(id, { isActive: false });
    return { message: "Reading test deactivated successfully" };
});
// Toggle active
const toggleActive = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield reading_model_1.ReadingTest.findById(id);
    if (!test) {
        throw new Error("Reading test not found");
    }
    test.isActive = !test.isActive;
    yield test.save();
    return {
        message: `Reading test ${test.isActive ? "activated" : "deactivated"} successfully`,
        isActive: test.isActive,
    };
});
// Get test summary
const getTestSummary = (testType) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { isActive: true };
    if (testType)
        query.testType = testType;
    const tests = yield reading_model_1.ReadingTest.find(query)
        .select("testId testNumber title testType difficulty usageCount source")
        .sort({ testNumber: 1 })
        .lean();
    return tests;
});
// Get statistics
const getStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [total, active, academic, generalTraining, totalUsage] = yield Promise.all([
        reading_model_1.ReadingTest.countDocuments({}),
        reading_model_1.ReadingTest.countDocuments({ isActive: true }),
        reading_model_1.ReadingTest.countDocuments({ testType: "academic", isActive: true }),
        reading_model_1.ReadingTest.countDocuments({ testType: "general-training", isActive: true }),
        reading_model_1.ReadingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
    ]);
    return {
        total,
        active,
        academic,
        generalTraining,
        totalUsage: ((_a = totalUsage[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
    };
});
exports.ReadingService = {
    createReadingTest,
    getAllReadingTests,
    getReadingTestById,
    getReadingTestByNumber,
    getReadingTestForExam,
    getAnswersForGrading,
    gradeReadingAnswers,
    updateReadingTest,
    deleteReadingTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
