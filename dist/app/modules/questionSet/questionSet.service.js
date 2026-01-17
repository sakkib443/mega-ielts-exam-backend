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
exports.QuestionSetService = void 0;
const questionSet_model_1 = require("./questionSet.model");
const mongoose_1 = require("mongoose");
// Import new separate collections
const listening_model_1 = require("../listening/listening.model");
const reading_model_1 = require("../reading/reading.model");
const writing_model_1 = require("../writing/writing.model");
const createQuestionSet = (data, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate set ID and number
    const { setId, setNumber } = yield (0, questionSet_model_1.generateSetId)(data.setType);
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
    else if (data.writingTasks && data.writingTasks.length > 0) {
        totalQuestions = data.writingTasks.length;
        totalMarks = 18; // Writing is scored differently
    }
    const questionSet = yield questionSet_model_1.QuestionSet.create(Object.assign(Object.assign({}, data), { setId,
        setNumber,
        totalQuestions,
        totalMarks, createdBy: new mongoose_1.Types.ObjectId(adminId) }));
    return questionSet;
});
// Get all question sets with filters - NOW USES NEW COLLECTIONS
const getAllQuestionSets = (filters, page = 1, limit = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    // Helper to build query for each collection
    const buildQuery = (isActive, difficulty, searchTerm) => {
        const q = {};
        if (typeof isActive === "boolean")
            q.isActive = isActive;
        if (difficulty)
            q.difficulty = difficulty;
        if (searchTerm) {
            q.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { testId: { $regex: searchTerm, $options: "i" } },
            ];
        }
        return q;
    };
    // If filtering by specific type, only query that collection
    if (filters.setType) {
        const query = buildQuery(filters.isActive, filters.difficulty, filters.searchTerm);
        let sets = [];
        let total = 0;
        if (filters.setType === "LISTENING") {
            [sets, total] = yield Promise.all([
                listening_model_1.ListeningTest.find(query)
                    .select("-sections.questions.correctAnswer")
                    .sort({ testNumber: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                listening_model_1.ListeningTest.countDocuments(query),
            ]);
            // Map to old format
            sets = sets.map(s => (Object.assign(Object.assign({}, s), { setId: s.testId, setNumber: s.testNumber, setType: "LISTENING" })));
        }
        else if (filters.setType === "READING") {
            [sets, total] = yield Promise.all([
                reading_model_1.ReadingTest.find(query)
                    .select("-passages.questionGroups.questions.correctAnswer")
                    .sort({ testNumber: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                reading_model_1.ReadingTest.countDocuments(query),
            ]);
            sets = sets.map(s => (Object.assign(Object.assign({}, s), { setId: s.testId, setNumber: s.testNumber, setType: "READING" })));
        }
        else if (filters.setType === "WRITING") {
            [sets, total] = yield Promise.all([
                writing_model_1.WritingTest.find(query)
                    .select("-tasks.sampleAnswer")
                    .sort({ testNumber: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                writing_model_1.WritingTest.countDocuments(query),
            ]);
            sets = sets.map(s => (Object.assign(Object.assign({}, s), { setId: s.testId, setNumber: s.testNumber, setType: "WRITING" })));
        }
        return {
            sets,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // If no type filter, get counts from all new collections
    const query = buildQuery(filters.isActive, filters.difficulty, filters.searchTerm);
    // Get all from each collection
    const [listeningTests, readingTests, writingTests] = yield Promise.all([
        listening_model_1.ListeningTest.find(query)
            .select("-sections.questions.correctAnswer")
            .sort({ testNumber: 1 })
            .lean(),
        reading_model_1.ReadingTest.find(query)
            .select("-passages.questionGroups.questions.correctAnswer")
            .sort({ testNumber: 1 })
            .lean(),
        writing_model_1.WritingTest.find(query)
            .select("-tasks.sampleAnswer")
            .sort({ testNumber: 1 })
            .lean(),
    ]);
    // Map to old format and combine
    const allSets = [
        ...listeningTests.map(s => (Object.assign(Object.assign({}, s), { setId: s.testId, setNumber: s.testNumber, setType: "LISTENING" }))),
        ...readingTests.map(s => (Object.assign(Object.assign({}, s), { setId: s.testId, setNumber: s.testNumber, setType: "READING" }))),
        ...writingTests.map(s => (Object.assign(Object.assign({}, s), { setId: s.testId, setNumber: s.testNumber, setType: "WRITING" }))),
    ];
    // Sort by setType then setNumber
    allSets.sort((a, b) => {
        const typeOrder = { LISTENING: 1, READING: 2, WRITING: 3 };
        if (typeOrder[a.setType] !== typeOrder[b.setType]) {
            return typeOrder[a.setType] - typeOrder[b.setType];
        }
        return a.setNumber - b.setNumber;
    });
    const total = allSets.length;
    const paginatedSets = allSets.slice(skip, skip + limit);
    return {
        sets: paginatedSets,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
// Get question set by ID (with answers for admin) - NOW USES NEW COLLECTIONS
const getQuestionSetById = (id, includeAnswers = false) => __awaiter(void 0, void 0, void 0, function* () {
    // Try to find in new collections first by MongoDB _id
    let set = null;
    let setType = "";
    // Try Listening
    set = includeAnswers
        ? yield listening_model_1.ListeningTest.findById(id).lean()
        : yield listening_model_1.ListeningTest.findById(id).select("-sections.questions.correctAnswer").lean();
    if (set) {
        setType = "LISTENING";
    }
    // Try Reading if not found
    if (!set) {
        set = includeAnswers
            ? yield reading_model_1.ReadingTest.findById(id).lean()
            : yield reading_model_1.ReadingTest.findById(id).select("-passages.questionGroups.questions.correctAnswer").lean();
        if (set) {
            setType = "READING";
        }
    }
    // Try Writing if not found
    if (!set) {
        set = includeAnswers
            ? yield writing_model_1.WritingTest.findById(id).lean()
            : yield writing_model_1.WritingTest.findById(id).select("-tasks.sampleAnswer").lean();
        if (set) {
            setType = "WRITING";
        }
    }
    // Fallback to old QuestionSet collection
    if (!set) {
        const selectFields = includeAnswers
            ? undefined
            : "-sections.questions.correctAnswer -writingTasks.sampleAnswer";
        set = selectFields
            ? yield questionSet_model_1.QuestionSet.findById(id).select(selectFields).lean()
            : yield questionSet_model_1.QuestionSet.findById(id).lean();
    }
    if (!set) {
        throw new Error("Question set not found");
    }
    // Map to old format if from new collection
    if (setType) {
        return Object.assign(Object.assign({}, set), { setId: set.testId, setNumber: set.testNumber, setType });
    }
    return set;
});
// Get question set by set number and type
const getQuestionSetByNumber = (setType, setNumber, includeAnswers = false) => __awaiter(void 0, void 0, void 0, function* () {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -writingTasks.sampleAnswer";
    const set = selectFields
        ? yield questionSet_model_1.QuestionSet.findOne({ setType, setNumber, isActive: true }).select(selectFields).lean()
        : yield questionSet_model_1.QuestionSet.findOne({ setType, setNumber, isActive: true }).lean();
    if (!set) {
        throw new Error(`${setType} Set #${setNumber} not found`);
    }
    // Increment usage count
    if (set._id) {
        yield questionSet_model_1.QuestionSet.findByIdAndUpdate(set._id, { $inc: { usageCount: 1 } });
    }
    return set;
});
// Get question set for exam (without answers) - NOW USES NEW COLLECTIONS
const getQuestionSetForExam = (setType, setNumber) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let data = null;
    if (setType === "LISTENING") {
        const test = yield listening_model_1.ListeningTest.findOne({ testNumber: setNumber, isActive: true })
            .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
            .lean();
        if (test) {
            // Convert to old format for backward compatibility
            data = {
                _id: test._id,
                setId: test.testId,
                setNumber: test.testNumber,
                setType: "LISTENING",
                title: test.title,
                description: test.description,
                mainAudioUrl: test.mainAudioUrl,
                audioDuration: test.audioDuration,
                sections: test.sections,
                totalQuestions: test.totalQuestions,
                totalMarks: test.totalMarks,
                duration: test.duration,
                difficulty: test.difficulty,
                isActive: test.isActive
            };
            // Increment usage
            yield listening_model_1.ListeningTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
        }
    }
    else if (setType === "READING") {
        const test = yield reading_model_1.ReadingTest.findOne({ testNumber: setNumber, isActive: true })
            .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
            .lean();
        if (test) {
            data = {
                _id: test._id,
                setId: test.testId,
                setNumber: test.testNumber,
                setType: "READING",
                title: test.title,
                description: test.description,
                sections: test.sections,
                totalQuestions: test.totalQuestions,
                totalMarks: test.totalMarks,
                duration: test.duration,
                difficulty: test.difficulty,
                isActive: test.isActive
            };
            yield reading_model_1.ReadingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
        }
    }
    else if (setType === "WRITING") {
        const test = yield writing_model_1.WritingTest.findOne({ testNumber: setNumber, isActive: true })
            .select("-tasks.sampleAnswer -tasks.keyPoints -tasks.bandDescriptors")
            .lean();
        if (test) {
            data = {
                _id: test._id,
                setId: test.testId,
                setNumber: test.testNumber,
                setType: "WRITING",
                title: test.title,
                description: test.description,
                writingTasks: (_a = test.tasks) === null || _a === void 0 ? void 0 : _a.map((task) => {
                    var _a, _b;
                    return ({
                        taskNumber: task.taskNumber,
                        prompt: task.prompt,
                        instructions: task.instructions,
                        minWords: task.minWords,
                        recommendedTime: task.recommendedTime,
                        imageUrl: (_b = (_a = task.images) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url,
                        letterContext: task.letterContext
                    });
                }),
                totalQuestions: 2,
                totalMarks: 18,
                duration: test.duration,
                difficulty: test.difficulty,
                isActive: test.isActive
            };
            yield writing_model_1.WritingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
        }
    }
    if (!data) {
        // Fallback to old collection
        const set = yield questionSet_model_1.QuestionSet.findOne({ setType, setNumber, isActive: true })
            .select("-sections.questions.correctAnswer -writingTasks.sampleAnswer")
            .lean();
        if (!set) {
            throw new Error(`${setType} Set #${setNumber} not found or inactive`);
        }
        return set;
    }
    return data;
});
// Get answers for grading - NOW USES NEW COLLECTIONS
const getAnswersForGrading = (setType, setNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const answerMap = {};
    if (setType === "LISTENING") {
        const test = yield listening_model_1.ListeningTest.findOne({ testNumber: setNumber })
            .select("sections.questions.questionNumber sections.questions.correctAnswer sections.questions.acceptableAnswers")
            .lean();
        if (test === null || test === void 0 ? void 0 : test.sections) {
            test.sections.forEach((section) => {
                var _a;
                (_a = section.questions) === null || _a === void 0 ? void 0 : _a.forEach((q) => {
                    answerMap[q.questionNumber] = q.correctAnswer;
                });
            });
            return answerMap;
        }
    }
    else if (setType === "READING") {
        const test = yield reading_model_1.ReadingTest.findOne({ testNumber: setNumber })
            .select("sections.questions.questionNumber sections.questions.correctAnswer sections.questions.acceptableAnswers")
            .lean();
        if (test === null || test === void 0 ? void 0 : test.sections) {
            test.sections.forEach((section) => {
                var _a;
                (_a = section.questions) === null || _a === void 0 ? void 0 : _a.forEach((q) => {
                    answerMap[q.questionNumber] = q.correctAnswer;
                });
            });
            return answerMap;
        }
    }
    // Fallback to old collection
    const set = yield questionSet_model_1.QuestionSet.findOne({ setType, setNumber })
        .select("sections.questions.questionNumber sections.questions.correctAnswer")
        .lean();
    if (!set) {
        throw new Error("Question set not found");
    }
    if (set.sections) {
        set.sections.forEach((section) => {
            section.questions.forEach((q) => {
                answerMap[q.questionNumber] = q.correctAnswer;
            });
        });
    }
    return answerMap;
});
// Update question set
const updateQuestionSet = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const set = yield questionSet_model_1.QuestionSet.findById(id);
    if (!set) {
        throw new Error("Question set not found");
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
    const updatedSet = yield questionSet_model_1.QuestionSet.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    return updatedSet;
});
// Delete question set - NOW USES NEW COLLECTIONS
const deleteQuestionSet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Try to find and deactivate in new collections first
    let result = yield listening_model_1.ListeningTest.findByIdAndUpdate(id, { isActive: false });
    if (result) {
        return { message: "Listening test deactivated successfully" };
    }
    result = yield reading_model_1.ReadingTest.findByIdAndUpdate(id, { isActive: false });
    if (result) {
        return { message: "Reading test deactivated successfully" };
    }
    result = yield writing_model_1.WritingTest.findByIdAndUpdate(id, { isActive: false });
    if (result) {
        return { message: "Writing test deactivated successfully" };
    }
    // Fallback to old collection
    const set = yield questionSet_model_1.QuestionSet.findById(id);
    if (!set) {
        throw new Error("Question set not found");
    }
    yield questionSet_model_1.QuestionSet.findByIdAndUpdate(id, { isActive: false });
    return { message: "Question set deactivated successfully" };
});
// Toggle active status - NOW USES NEW COLLECTIONS
const toggleActive = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Try to find in new collections first
    let set = yield listening_model_1.ListeningTest.findById(id);
    if (set) {
        set.isActive = !set.isActive;
        yield set.save();
        return {
            message: `Listening test ${set.isActive ? "activated" : "deactivated"} successfully`,
            isActive: set.isActive,
        };
    }
    set = yield reading_model_1.ReadingTest.findById(id);
    if (set) {
        set.isActive = !set.isActive;
        yield set.save();
        return {
            message: `Reading test ${set.isActive ? "activated" : "deactivated"} successfully`,
            isActive: set.isActive,
        };
    }
    set = yield writing_model_1.WritingTest.findById(id);
    if (set) {
        set.isActive = !set.isActive;
        yield set.save();
        return {
            message: `Writing test ${set.isActive ? "activated" : "deactivated"} successfully`,
            isActive: set.isActive,
        };
    }
    // Fallback to old collection
    set = yield questionSet_model_1.QuestionSet.findById(id);
    if (!set) {
        throw new Error("Question set not found");
    }
    set.isActive = !set.isActive;
    yield set.save();
    return {
        message: `Question set ${set.isActive ? "activated" : "deactivated"} successfully`,
        isActive: set.isActive,
    };
});
// Get set summary (for dropdown selection) - NOW USES NEW COLLECTIONS
const getSetSummary = (setType) => __awaiter(void 0, void 0, void 0, function* () {
    let sets = [];
    if (setType === "LISTENING") {
        const tests = yield listening_model_1.ListeningTest.find({ isActive: true })
            .select("testId testNumber title difficulty usageCount")
            .sort({ testNumber: 1 })
            .lean();
        sets = tests.map(t => ({
            setId: t.testId,
            setNumber: t.testNumber,
            title: t.title,
            difficulty: t.difficulty,
            usageCount: t.usageCount
        }));
    }
    else if (setType === "READING") {
        const tests = yield reading_model_1.ReadingTest.find({ isActive: true })
            .select("testId testNumber title difficulty usageCount")
            .sort({ testNumber: 1 })
            .lean();
        sets = tests.map(t => ({
            setId: t.testId,
            setNumber: t.testNumber,
            title: t.title,
            difficulty: t.difficulty,
            usageCount: t.usageCount
        }));
    }
    else if (setType === "WRITING") {
        const tests = yield writing_model_1.WritingTest.find({ isActive: true })
            .select("testId testNumber title difficulty usageCount")
            .sort({ testNumber: 1 })
            .lean();
        sets = tests.map(t => ({
            setId: t.testId,
            setNumber: t.testNumber,
            title: t.title,
            difficulty: t.difficulty,
            usageCount: t.usageCount
        }));
    }
    // Fallback to old collection
    if (sets.length === 0) {
        sets = yield questionSet_model_1.QuestionSet.find({ setType, isActive: true })
            .select("setId setNumber title difficulty usageCount")
            .sort({ setNumber: 1 })
            .lean();
    }
    return sets;
});
// Get statistics - NOW USES NEW COLLECTIONS
const getStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const [listeningCount, readingCount, writingCount, listeningUsage, readingUsage, writingUsage] = yield Promise.all([
        listening_model_1.ListeningTest.countDocuments({ isActive: true }),
        reading_model_1.ReadingTest.countDocuments({ isActive: true }),
        writing_model_1.WritingTest.countDocuments({ isActive: true }),
        listening_model_1.ListeningTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
        reading_model_1.ReadingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
        writing_model_1.WritingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
    ]);
    const totalUsage = (((_b = listeningUsage[0]) === null || _b === void 0 ? void 0 : _b.total) || 0) +
        (((_c = readingUsage[0]) === null || _c === void 0 ? void 0 : _c.total) || 0) +
        (((_d = writingUsage[0]) === null || _d === void 0 ? void 0 : _d.total) || 0);
    return {
        listening: listeningCount,
        reading: readingCount,
        writing: writingCount,
        totalUsage,
    };
});
exports.QuestionSetService = {
    createQuestionSet,
    getAllQuestionSets,
    getQuestionSetById,
    getQuestionSetByNumber,
    getQuestionSetForExam,
    getAnswersForGrading,
    updateQuestionSet,
    deleteQuestionSet,
    toggleActive,
    getSetSummary,
    getStatistics,
};
