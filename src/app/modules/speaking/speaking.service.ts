import { Types } from "mongoose";
import { SpeakingTest, generateSpeakingTestId } from "./speaking.model";
import {
    ICreateSpeakingTestInput,
    ISpeakingTestFilters,
} from "./speaking.interface";

// Create new speaking test
const createSpeakingTest = async (
    data: ICreateSpeakingTestInput,
    adminId: string
) => {
    const { testId, testNumber } = await generateSpeakingTestId();

    // Calculate total questions
    let totalQuestions = 0;

    if (data.part1?.topics) {
        data.part1.topics.forEach((topic) => {
            totalQuestions += topic.questions.length;
        });
    }

    // Part 2 = 1 main question + follow-up questions
    totalQuestions += 1;
    if (data.part2?.followUpQuestions) {
        totalQuestions += data.part2.followUpQuestions.length;
    }

    if (data.part3?.questions) {
        totalQuestions += data.part3.questions.length;
    }

    // Calculate total duration
    const duration = (data.part1?.duration || 5) +
        Math.ceil(((data.part2?.preparationTime || 60) + (data.part2?.speakingTime || 120)) / 60) +
        (data.part3?.duration || 5);

    const speakingTest = await SpeakingTest.create({
        ...data,
        testId,
        testNumber,
        totalQuestions,
        duration,
        createdBy: new Types.ObjectId(adminId),
    });

    return speakingTest;
};

// Get all speaking tests with filters
const getAllSpeakingTests = async (
    filters: ISpeakingTestFilters,
    page: number = 1,
    limit: number = 10
) => {
    const query: Record<string, unknown> = {};

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

    const [tests, total] = await Promise.all([
        SpeakingTest.find(query)
            .sort({ testNumber: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        SpeakingTest.countDocuments(query),
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

// Get speaking test by ID
const getSpeakingTestById = async (id: string) => {
    const test = await SpeakingTest.findById(id).lean();

    if (!test) {
        throw new Error("Speaking test not found");
    }

    return test;
};

// Get speaking test by test number
const getSpeakingTestByNumber = async (testNumber: number) => {
    const test = await SpeakingTest.findOne({ testNumber, isActive: true }).lean();

    if (!test) {
        throw new Error(`Speaking Test #${testNumber} not found`);
    }

    // Increment usage count
    await SpeakingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });

    return test;
};

// Get speaking test for exam
const getSpeakingTestForExam = async (testNumber: number) => {
    const test = await SpeakingTest.findOne({ testNumber, isActive: true }).lean();

    if (!test) {
        throw new Error(`Speaking Test #${testNumber} not found or inactive`);
    }

    return test;
};

// Update speaking test
const updateSpeakingTest = async (
    id: string,
    updateData: Partial<ICreateSpeakingTestInput>
) => {
    const test = await SpeakingTest.findById(id);
    if (!test) {
        throw new Error("Speaking test not found");
    }

    // Recalculate totals if parts changed
    if (updateData.part1 || updateData.part2 || updateData.part3) {
        let totalQuestions = 0;

        const part1 = updateData.part1 || test.part1;
        const part2 = updateData.part2 || test.part2;
        const part3 = updateData.part3 || test.part3;

        if (part1?.topics) {
            part1.topics.forEach((topic) => {
                totalQuestions += topic.questions.length;
            });
        }

        totalQuestions += 1; // Part 2 main question
        if (part2?.followUpQuestions) {
            totalQuestions += part2.followUpQuestions.length;
        }

        if (part3?.questions) {
            totalQuestions += part3.questions.length;
        }

        (updateData as any).totalQuestions = totalQuestions;
    }

    const updatedTest = await SpeakingTest.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedTest;
};

// Delete speaking test (soft delete)
const deleteSpeakingTest = async (id: string) => {
    const test = await SpeakingTest.findById(id);
    if (!test) {
        throw new Error("Speaking test not found");
    }

    await SpeakingTest.findByIdAndUpdate(id, { isActive: false });

    return { message: "Speaking test deactivated successfully" };
};

// Toggle active status
const toggleActive = async (id: string) => {
    const test = await SpeakingTest.findById(id);
    if (!test) {
        throw new Error("Speaking test not found");
    }

    test.isActive = !test.isActive;
    await test.save();

    return {
        message: `Speaking test ${test.isActive ? "activated" : "deactivated"} successfully`,
        isActive: test.isActive,
    };
};

// Get test summary for dropdown
const getTestSummary = async () => {
    const tests = await SpeakingTest.find({ isActive: true })
        .select("testId testNumber title difficulty usageCount source")
        .sort({ testNumber: 1 })
        .lean();

    return tests;
};

// Get statistics
const getStatistics = async () => {
    const [total, active, totalUsage, byDifficulty] = await Promise.all([
        SpeakingTest.countDocuments({}),
        SpeakingTest.countDocuments({ isActive: true }),
        SpeakingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
        SpeakingTest.aggregate([
            { $group: { _id: "$difficulty", count: { $sum: 1 } } },
        ]),
    ]);

    return {
        total,
        active,
        totalUsage: totalUsage[0]?.total || 0,
        byDifficulty: byDifficulty.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {} as Record<string, number>),
    };
};

export const SpeakingService = {
    createSpeakingTest,
    getAllSpeakingTests,
    getSpeakingTestById,
    getSpeakingTestByNumber,
    getSpeakingTestForExam,
    updateSpeakingTest,
    deleteSpeakingTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
