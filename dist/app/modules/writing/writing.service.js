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
exports.WritingService = void 0;
const mongoose_1 = require("mongoose");
const writing_model_1 = require("./writing.model");
const writing_interface_1 = require("./writing.interface");
// Create new writing test
const createWritingTest = (data, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { testId, testNumber } = yield (0, writing_model_1.generateWritingTestId)();
    const writingTest = yield writing_model_1.WritingTest.create(Object.assign(Object.assign({}, data), { testId,
        testNumber, totalTasks: ((_a = data.tasks) === null || _a === void 0 ? void 0 : _a.length) || 2, createdBy: new mongoose_1.Types.ObjectId(adminId) }));
    return writingTest;
});
// Get all writing tests
const getAllWritingTests = (filters, page = 1, limit = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (filters.testType) {
        query.testType = filters.testType;
    }
    if (filters.difficulty) {
        query.difficulty = filters.difficulty;
    }
    if (filters.topicCategory) {
        query.topicCategories = filters.topicCategory;
    }
    if (typeof filters.isActive === "boolean") {
        query.isActive = filters.isActive;
    }
    if (filters.searchTerm) {
        query.$or = [
            { title: { $regex: filters.searchTerm, $options: "i" } },
            { testId: { $regex: filters.searchTerm, $options: "i" } },
            { source: { $regex: filters.searchTerm, $options: "i" } },
            { "tasks.prompt": { $regex: filters.searchTerm, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [tests, total] = yield Promise.all([
        writing_model_1.WritingTest.find(query)
            .select("-tasks.sampleAnswer -tasks.keyPoints") // Hide sample answers in list
            .sort({ testNumber: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        writing_model_1.WritingTest.countDocuments(query),
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
// Get writing test by ID
const getWritingTestById = (id, includeSamples = false) => __awaiter(void 0, void 0, void 0, function* () {
    const selectFields = includeSamples
        ? undefined
        : "-tasks.sampleAnswer -tasks.keyPoints";
    const test = selectFields
        ? yield writing_model_1.WritingTest.findById(id).select(selectFields).lean()
        : yield writing_model_1.WritingTest.findById(id).lean();
    if (!test) {
        throw new Error("Writing test not found");
    }
    return test;
});
// Get writing test by number
const getWritingTestByNumber = (testNumber, includeSamples = false) => __awaiter(void 0, void 0, void 0, function* () {
    const selectFields = includeSamples
        ? undefined
        : "-tasks.sampleAnswer -tasks.keyPoints";
    const test = selectFields
        ? yield writing_model_1.WritingTest.findOne({ testNumber, isActive: true }).select(selectFields).lean()
        : yield writing_model_1.WritingTest.findOne({ testNumber, isActive: true }).lean();
    if (!test) {
        throw new Error(`Writing Test #${testNumber} not found`);
    }
    yield writing_model_1.WritingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
    return test;
});
// Get writing test for exam
const getWritingTestForExam = (testNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield writing_model_1.WritingTest.findOne({ testNumber, isActive: true })
        .select("-tasks.sampleAnswer -tasks.keyPoints -tasks.bandDescriptors")
        .lean();
    if (!test) {
        throw new Error(`Writing Test #${testNumber} not found or inactive`);
    }
    return test;
});
// Submit writing response
const submitWritingResponse = (studentId, testNumber, taskNumber, response) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate word count
    const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length;
    const submission = yield writing_model_1.WritingSubmission.create({
        studentId: new mongoose_1.Types.ObjectId(studentId),
        testNumber,
        taskNumber,
        response,
        wordCount,
        markingStatus: "pending"
    });
    return {
        submissionId: submission._id,
        wordCount,
        minWords: taskNumber === 1 ? 150 : 250,
        meetsRequirement: wordCount >= (taskNumber === 1 ? 150 : 250)
    };
});
// Mark writing submission (by examiner)
const markWritingSubmission = (submissionId, examinerId, scores, feedback) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = yield writing_model_1.WritingSubmission.findById(submissionId);
    if (!submission) {
        throw new Error("Submission not found");
    }
    const bandScore = (0, writing_interface_1.calculateWritingBand)(scores);
    submission.scores = scores;
    submission.bandScore = bandScore;
    submission.feedback = feedback;
    submission.markingStatus = "marked";
    submission.markedBy = new mongoose_1.Types.ObjectId(examinerId);
    submission.markedAt = new Date();
    yield submission.save();
    return {
        submissionId: submission._id,
        bandScore,
        scores,
        feedback
    };
});
// Get pending submissions for marking
const getPendingSubmissions = (page = 1, limit = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [submissions, total] = yield Promise.all([
        writing_model_1.WritingSubmission.find({ markingStatus: "pending" })
            .sort({ submittedAt: 1 }) // Oldest first
            .skip(skip)
            .limit(limit)
            .lean(),
        writing_model_1.WritingSubmission.countDocuments({ markingStatus: "pending" })
    ]);
    return {
        submissions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
});
// Update writing test
const updateWritingTest = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield writing_model_1.WritingTest.findById(id);
    if (!test) {
        throw new Error("Writing test not found");
    }
    if (updateData.tasks) {
        updateData.totalTasks = updateData.tasks.length;
    }
    const updatedTest = yield writing_model_1.WritingTest.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    return updatedTest;
});
// Delete writing test
const deleteWritingTest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield writing_model_1.WritingTest.findById(id);
    if (!test) {
        throw new Error("Writing test not found");
    }
    yield writing_model_1.WritingTest.findByIdAndUpdate(id, { isActive: false });
    return { message: "Writing test deactivated successfully" };
});
// Toggle active
const toggleActive = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield writing_model_1.WritingTest.findById(id);
    if (!test) {
        throw new Error("Writing test not found");
    }
    test.isActive = !test.isActive;
    yield test.save();
    return {
        message: `Writing test ${test.isActive ? "activated" : "deactivated"} successfully`,
        isActive: test.isActive,
    };
});
// Get test summary
const getTestSummary = (testType) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { isActive: true };
    if (testType)
        query.testType = testType;
    const tests = yield writing_model_1.WritingTest.find(query)
        .select("testId testNumber title testType difficulty topicCategories usageCount source")
        .sort({ testNumber: 1 })
        .lean();
    return tests;
});
// Get statistics
const getStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const [total, active, academic, generalTraining, pendingMarking, totalUsage] = yield Promise.all([
        writing_model_1.WritingTest.countDocuments({}),
        writing_model_1.WritingTest.countDocuments({ isActive: true }),
        writing_model_1.WritingTest.countDocuments({ testType: "academic", isActive: true }),
        writing_model_1.WritingTest.countDocuments({ testType: "general-training", isActive: true }),
        writing_model_1.WritingSubmission.countDocuments({ markingStatus: "pending" }),
        writing_model_1.WritingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
    ]);
    // Get topic distribution
    const topicDistribution = yield writing_model_1.WritingTest.aggregate([
        { $unwind: "$topicCategories" },
        { $group: { _id: "$topicCategories", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);
    return {
        total,
        active,
        academic,
        generalTraining,
        pendingMarking,
        totalUsage: ((_b = totalUsage[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
        topicDistribution: topicDistribution.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {}),
    };
});
exports.WritingService = {
    createWritingTest,
    getAllWritingTests,
    getWritingTestById,
    getWritingTestByNumber,
    getWritingTestForExam,
    submitWritingResponse,
    markWritingSubmission,
    getPendingSubmissions,
    updateWritingTest,
    deleteWritingTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
