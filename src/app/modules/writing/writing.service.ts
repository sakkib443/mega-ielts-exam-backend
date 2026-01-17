import { Types } from "mongoose";
import { WritingTest, WritingSubmission, generateWritingTestId } from "./writing.model";
import {
    ICreateWritingTestInput,
    IWritingTestFilters,
    IWritingScoreCriteria,
    calculateWritingBand
} from "./writing.interface";

// Create new writing test
const createWritingTest = async (
    data: ICreateWritingTestInput,
    adminId: string
) => {
    const { testId, testNumber } = await generateWritingTestId();

    const writingTest = await WritingTest.create({
        ...data,
        testId,
        testNumber,
        totalTasks: data.tasks?.length || 2,
        createdBy: new Types.ObjectId(adminId),
    });

    return writingTest;
};

// Get all writing tests
const getAllWritingTests = async (
    filters: IWritingTestFilters,
    page: number = 1,
    limit: number = 10
) => {
    const query: Record<string, unknown> = {};

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

    const [tests, total] = await Promise.all([
        WritingTest.find(query)
            .select("-tasks.sampleAnswer -tasks.keyPoints")  // Hide sample answers in list
            .sort({ testNumber: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        WritingTest.countDocuments(query),
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
};

// Get writing test by ID
const getWritingTestById = async (id: string, includeSamples: boolean = false) => {
    const selectFields = includeSamples
        ? undefined
        : "-tasks.sampleAnswer -tasks.keyPoints";

    const test = selectFields
        ? await WritingTest.findById(id).select(selectFields).lean()
        : await WritingTest.findById(id).lean();

    if (!test) {
        throw new Error("Writing test not found");
    }

    return test;
};

// Get writing test by number
const getWritingTestByNumber = async (testNumber: number, includeSamples: boolean = false) => {
    const selectFields = includeSamples
        ? undefined
        : "-tasks.sampleAnswer -tasks.keyPoints";

    const test = selectFields
        ? await WritingTest.findOne({ testNumber, isActive: true }).select(selectFields).lean()
        : await WritingTest.findOne({ testNumber, isActive: true }).lean();

    if (!test) {
        throw new Error(`Writing Test #${testNumber} not found`);
    }

    await WritingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });

    return test;
};

// Get writing test for exam
const getWritingTestForExam = async (testNumber: number) => {
    const test = await WritingTest.findOne({ testNumber, isActive: true })
        .select("-tasks.sampleAnswer -tasks.keyPoints -tasks.bandDescriptors")
        .lean();

    if (!test) {
        throw new Error(`Writing Test #${testNumber} not found or inactive`);
    }

    return test;
};

// Submit writing response
const submitWritingResponse = async (
    studentId: string,
    testNumber: number,
    taskNumber: 1 | 2,
    response: string
) => {
    // Calculate word count
    const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length;

    const submission = await WritingSubmission.create({
        studentId: new Types.ObjectId(studentId),
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
};

// Mark writing submission (by examiner)
const markWritingSubmission = async (
    submissionId: string,
    examinerId: string,
    scores: IWritingScoreCriteria,
    feedback: {
        overall: string;
        taskAchievement?: string;
        coherenceCohesion?: string;
        lexicalResource?: string;
        grammaticalRange?: string;
    }
) => {
    const submission = await WritingSubmission.findById(submissionId);

    if (!submission) {
        throw new Error("Submission not found");
    }

    const bandScore = calculateWritingBand(scores);

    submission.scores = scores;
    submission.bandScore = bandScore;
    submission.feedback = feedback;
    submission.markingStatus = "marked";
    submission.markedBy = new Types.ObjectId(examinerId);
    submission.markedAt = new Date();

    await submission.save();

    return {
        submissionId: submission._id,
        bandScore,
        scores,
        feedback
    };
};

// Get pending submissions for marking
const getPendingSubmissions = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
        WritingSubmission.find({ markingStatus: "pending" })
            .sort({ submittedAt: 1 })  // Oldest first
            .skip(skip)
            .limit(limit)
            .lean(),
        WritingSubmission.countDocuments({ markingStatus: "pending" })
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
};

// Update writing test
const updateWritingTest = async (
    id: string,
    updateData: Partial<ICreateWritingTestInput>
) => {
    const test = await WritingTest.findById(id);
    if (!test) {
        throw new Error("Writing test not found");
    }

    if (updateData.tasks) {
        (updateData as any).totalTasks = updateData.tasks.length;
    }

    const updatedTest = await WritingTest.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedTest;
};

// Delete writing test
const deleteWritingTest = async (id: string) => {
    const test = await WritingTest.findById(id);
    if (!test) {
        throw new Error("Writing test not found");
    }

    await WritingTest.findByIdAndUpdate(id, { isActive: false });

    return { message: "Writing test deactivated successfully" };
};

// Toggle active
const toggleActive = async (id: string) => {
    const test = await WritingTest.findById(id);
    if (!test) {
        throw new Error("Writing test not found");
    }

    test.isActive = !test.isActive;
    await test.save();

    return {
        message: `Writing test ${test.isActive ? "activated" : "deactivated"} successfully`,
        isActive: test.isActive,
    };
};

// Get test summary
const getTestSummary = async (testType?: string) => {
    const query: Record<string, unknown> = { isActive: true };
    if (testType) query.testType = testType;

    const tests = await WritingTest.find(query)
        .select("testId testNumber title testType difficulty topicCategories usageCount source")
        .sort({ testNumber: 1 })
        .lean();

    return tests;
};

// Get statistics
const getStatistics = async () => {
    const [
        total,
        active,
        academic,
        generalTraining,
        pendingMarking,
        totalUsage
    ] = await Promise.all([
        WritingTest.countDocuments({}),
        WritingTest.countDocuments({ isActive: true }),
        WritingTest.countDocuments({ testType: "academic", isActive: true }),
        WritingTest.countDocuments({ testType: "general-training", isActive: true }),
        WritingSubmission.countDocuments({ markingStatus: "pending" }),
        WritingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
    ]);

    // Get topic distribution
    const topicDistribution = await WritingTest.aggregate([
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
        totalUsage: totalUsage[0]?.total || 0,
        topicDistribution: topicDistribution.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {} as Record<string, number>),
    };
};

export const WritingService = {
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
