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
exports.ListeningService = void 0;
const mongoose_1 = require("mongoose");
const listening_model_1 = require("./listening.model");
const listening_interface_1 = require("./listening.interface");
// Create new listening test
const createListeningTest = (data, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const { testId, testNumber } = yield (0, listening_model_1.generateListeningTestId)();
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
    const listeningTest = yield listening_model_1.ListeningTest.create(Object.assign(Object.assign({}, data), { testId,
        testNumber,
        totalQuestions,
        totalMarks, createdBy: new mongoose_1.Types.ObjectId(adminId) }));
    return listeningTest;
});
// Get all listening tests with filters
const getAllListeningTests = (filters, page = 1, limit = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
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
        listening_model_1.ListeningTest.find(query)
            .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
            .sort({ testNumber: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        listening_model_1.ListeningTest.countDocuments(query),
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
// Get listening test by ID (with answers for admin)
const getListeningTestById = (id, includeAnswers = false) => __awaiter(void 0, void 0, void 0, function* () {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";
    const test = selectFields
        ? yield listening_model_1.ListeningTest.findById(id).select(selectFields).lean()
        : yield listening_model_1.ListeningTest.findById(id).lean();
    if (!test) {
        throw new Error("Listening test not found");
    }
    return test;
});
// Get listening test by test number
const getListeningTestByNumber = (testNumber, includeAnswers = false) => __awaiter(void 0, void 0, void 0, function* () {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";
    const test = selectFields
        ? yield listening_model_1.ListeningTest.findOne({ testNumber, isActive: true }).select(selectFields).lean()
        : yield listening_model_1.ListeningTest.findOne({ testNumber, isActive: true }).lean();
    if (!test) {
        throw new Error(`Listening Test #${testNumber} not found`);
    }
    // Increment usage count
    yield listening_model_1.ListeningTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
    return test;
});
// Get listening test for exam (without answers)
const getListeningTestForExam = (testNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield listening_model_1.ListeningTest.findOne({ testNumber, isActive: true })
        .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
        .lean();
    if (!test) {
        throw new Error(`Listening Test #${testNumber} not found or inactive`);
    }
    return test;
});
// Get answers for grading
const getAnswersForGrading = (testNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield listening_model_1.ListeningTest.findOne({ testNumber })
        .select("sections.questions.questionNumber sections.questions.correctAnswer sections.questions.acceptableAnswers")
        .lean();
    if (!test) {
        throw new Error("Listening test not found");
    }
    // Build answer map
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
    return answerMap;
});
// Grade student answers
const gradeListeningAnswers = (testNumber, studentAnswers) => __awaiter(void 0, void 0, void 0, function* () {
    const answerMap = yield getAnswersForGrading(testNumber);
    let correctCount = 0;
    const results = {};
    for (const [questionNum, studentAnswer] of Object.entries(studentAnswers)) {
        const qNum = parseInt(questionNum);
        const correctData = answerMap[qNum];
        if (!correctData)
            continue;
        // Normalize answers for comparison
        const normalizeAnswer = (ans) => ans === null || ans === void 0 ? void 0 : ans.toLowerCase().trim().replace(/[.,!?]/g, "");
        const studentNormalized = normalizeAnswer(studentAnswer);
        // Check if answer matches correct answer(s)
        let isCorrect = false;
        if (Array.isArray(correctData.correct)) {
            // For multiple correct answers
            isCorrect = correctData.correct.some(ca => normalizeAnswer(ca) === studentNormalized);
        }
        else {
            isCorrect = normalizeAnswer(correctData.correct) === studentNormalized;
        }
        // Check acceptable answers if not correct
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
    const bandScore = (0, listening_interface_1.getListeningBandScore)(correctCount);
    return {
        correctCount,
        totalQuestions: Object.keys(answerMap).length,
        bandScore,
        results
    };
});
// Update listening test
const updateListeningTest = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield listening_model_1.ListeningTest.findById(id);
    if (!test) {
        throw new Error("Listening test not found");
    }
    // Recalculate totals if sections changed
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
    const updatedTest = yield listening_model_1.ListeningTest.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    return updatedTest;
});
// Delete listening test (soft delete)
const deleteListeningTest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield listening_model_1.ListeningTest.findById(id);
    if (!test) {
        throw new Error("Listening test not found");
    }
    yield listening_model_1.ListeningTest.findByIdAndUpdate(id, { isActive: false });
    return { message: "Listening test deactivated successfully" };
});
// Toggle active status
const toggleActive = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield listening_model_1.ListeningTest.findById(id);
    if (!test) {
        throw new Error("Listening test not found");
    }
    test.isActive = !test.isActive;
    yield test.save();
    return {
        message: `Listening test ${test.isActive ? "activated" : "deactivated"} successfully`,
        isActive: test.isActive,
    };
});
// Get test summary for dropdown
const getTestSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const tests = yield listening_model_1.ListeningTest.find({ isActive: true })
        .select("testId testNumber title difficulty usageCount source")
        .sort({ testNumber: 1 })
        .lean();
    return tests;
});
// Get statistics
const getStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [total, active, totalUsage, byDifficulty] = yield Promise.all([
        listening_model_1.ListeningTest.countDocuments({}),
        listening_model_1.ListeningTest.countDocuments({ isActive: true }),
        listening_model_1.ListeningTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
        listening_model_1.ListeningTest.aggregate([
            { $group: { _id: "$difficulty", count: { $sum: 1 } } },
        ]),
    ]);
    return {
        total,
        active,
        totalUsage: ((_a = totalUsage[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        byDifficulty: byDifficulty.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {}),
    };
});
exports.ListeningService = {
    createListeningTest,
    getAllListeningTests,
    getListeningTestById,
    getListeningTestByNumber,
    getListeningTestForExam,
    getAnswersForGrading,
    gradeListeningAnswers,
    updateListeningTest,
    deleteListeningTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
