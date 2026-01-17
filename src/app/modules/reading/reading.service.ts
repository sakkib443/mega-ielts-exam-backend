import { Types } from "mongoose";
import { ReadingTest, generateReadingTestId } from "./reading.model";
import {
    ICreateReadingTestInput,
    IReadingTestFilters,
    getReadingBandScore
} from "./reading.interface";

// Create new reading test
const createReadingTest = async (
    data: ICreateReadingTestInput,
    adminId: string
) => {
    const { testId, testNumber } = await generateReadingTestId();

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

    const readingTest = await ReadingTest.create({
        ...data,
        testId,
        testNumber,
        totalQuestions,
        totalMarks,
        createdBy: new Types.ObjectId(adminId),
    });

    return readingTest;
};

// Get all reading tests
const getAllReadingTests = async (
    filters: IReadingTestFilters,
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
        ReadingTest.find(query)
            .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
            .sort({ testNumber: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        ReadingTest.countDocuments(query),
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

// Get reading test by ID
const getReadingTestById = async (id: string, includeAnswers: boolean = false) => {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";

    const test = selectFields
        ? await ReadingTest.findById(id).select(selectFields).lean()
        : await ReadingTest.findById(id).lean();

    if (!test) {
        throw new Error("Reading test not found");
    }

    return test;
};

// Get reading test by number
const getReadingTestByNumber = async (testNumber: number, includeAnswers: boolean = false) => {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";

    const test = selectFields
        ? await ReadingTest.findOne({ testNumber, isActive: true }).select(selectFields).lean()
        : await ReadingTest.findOne({ testNumber, isActive: true }).lean();

    if (!test) {
        throw new Error(`Reading Test #${testNumber} not found`);
    }

    await ReadingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });

    return test;
};

// Get reading test for exam
const getReadingTestForExam = async (testNumber: number) => {
    const test = await ReadingTest.findOne({ testNumber, isActive: true })
        .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
        .lean();

    if (!test) {
        throw new Error(`Reading Test #${testNumber} not found or inactive`);
    }

    return test;
};

// Get answers for grading
const getAnswersForGrading = async (testNumber: number) => {
    const test = await ReadingTest.findOne({ testNumber })
        .select("sections.questions.questionNumber sections.questions.correctAnswer sections.questions.acceptableAnswers testType")
        .lean();

    if (!test) {
        throw new Error("Reading test not found");
    }

    const answerMap: Record<number, { correct: string | string[]; acceptable?: string[] }> = {};

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
};

// Grade reading answers
const gradeReadingAnswers = async (
    testNumber: number,
    studentAnswers: Record<number, string>
) => {
    const { answerMap, testType } = await getAnswersForGrading(testNumber);

    let correctCount = 0;
    const results: Record<number, {
        studentAnswer: string;
        correctAnswer: string | string[];
        isCorrect: boolean
    }> = {};

    for (const [questionNum, studentAnswer] of Object.entries(studentAnswers)) {
        const qNum = parseInt(questionNum);
        const correctData = answerMap[qNum];

        if (!correctData) continue;

        const normalizeAnswer = (ans: string) =>
            ans?.toLowerCase().trim().replace(/[.,!?]/g, "");

        const studentNormalized = normalizeAnswer(studentAnswer);

        let isCorrect = false;

        if (Array.isArray(correctData.correct)) {
            isCorrect = correctData.correct.some(ca =>
                normalizeAnswer(ca) === studentNormalized
            );
        } else {
            isCorrect = normalizeAnswer(correctData.correct) === studentNormalized;
        }

        if (!isCorrect && correctData.acceptable) {
            isCorrect = correctData.acceptable.some(aa =>
                normalizeAnswer(aa) === studentNormalized
            );
        }

        if (isCorrect) correctCount++;

        results[qNum] = {
            studentAnswer,
            correctAnswer: correctData.correct,
            isCorrect
        };
    }

    const bandScore = getReadingBandScore(correctCount, testType as "academic" | "general-training");

    return {
        correctCount,
        totalQuestions: Object.keys(answerMap).length,
        bandScore,
        testType,
        results
    };
};

// Update reading test
const updateReadingTest = async (
    id: string,
    updateData: Partial<ICreateReadingTestInput>
) => {
    const test = await ReadingTest.findById(id);
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
        (updateData as any).totalQuestions = totalQuestions;
        (updateData as any).totalMarks = totalMarks;
    }

    const updatedTest = await ReadingTest.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedTest;
};

// Delete reading test
const deleteReadingTest = async (id: string) => {
    const test = await ReadingTest.findById(id);
    if (!test) {
        throw new Error("Reading test not found");
    }

    await ReadingTest.findByIdAndUpdate(id, { isActive: false });

    return { message: "Reading test deactivated successfully" };
};

// Toggle active
const toggleActive = async (id: string) => {
    const test = await ReadingTest.findById(id);
    if (!test) {
        throw new Error("Reading test not found");
    }

    test.isActive = !test.isActive;
    await test.save();

    return {
        message: `Reading test ${test.isActive ? "activated" : "deactivated"} successfully`,
        isActive: test.isActive,
    };
};

// Get test summary
const getTestSummary = async (testType?: string) => {
    const query: Record<string, unknown> = { isActive: true };
    if (testType) query.testType = testType;

    const tests = await ReadingTest.find(query)
        .select("testId testNumber title testType difficulty usageCount source")
        .sort({ testNumber: 1 })
        .lean();

    return tests;
};

// Get statistics
const getStatistics = async () => {
    const [total, active, academic, generalTraining, totalUsage] = await Promise.all([
        ReadingTest.countDocuments({}),
        ReadingTest.countDocuments({ isActive: true }),
        ReadingTest.countDocuments({ testType: "academic", isActive: true }),
        ReadingTest.countDocuments({ testType: "general-training", isActive: true }),
        ReadingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
    ]);

    return {
        total,
        active,
        academic,
        generalTraining,
        totalUsage: totalUsage[0]?.total || 0,
    };
};

export const ReadingService = {
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
