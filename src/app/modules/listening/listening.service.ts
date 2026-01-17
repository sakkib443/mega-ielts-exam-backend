import { Types } from "mongoose";
import { ListeningTest, generateListeningTestId } from "./listening.model";
import {
    ICreateListeningTestInput,
    IListeningTestFilters,
    getListeningBandScore
} from "./listening.interface";

// Create new listening test
const createListeningTest = async (
    data: ICreateListeningTestInput,
    adminId: string
) => {
    const { testId, testNumber } = await generateListeningTestId();

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

    const listeningTest = await ListeningTest.create({
        ...data,
        testId,
        testNumber,
        totalQuestions,
        totalMarks,
        createdBy: new Types.ObjectId(adminId),
    });

    return listeningTest;
};

// Get all listening tests with filters
const getAllListeningTests = async (
    filters: IListeningTestFilters,
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
        ListeningTest.find(query)
            .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
            .sort({ testNumber: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        ListeningTest.countDocuments(query),
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

// Get listening test by ID (with answers for admin)
const getListeningTestById = async (id: string, includeAnswers: boolean = false) => {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";

    const test = selectFields
        ? await ListeningTest.findById(id).select(selectFields).lean()
        : await ListeningTest.findById(id).lean();

    if (!test) {
        throw new Error("Listening test not found");
    }

    return test;
};

// Get listening test by test number
const getListeningTestByNumber = async (testNumber: number, includeAnswers: boolean = false) => {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation";

    const test = selectFields
        ? await ListeningTest.findOne({ testNumber, isActive: true }).select(selectFields).lean()
        : await ListeningTest.findOne({ testNumber, isActive: true }).lean();

    if (!test) {
        throw new Error(`Listening Test #${testNumber} not found`);
    }

    // Increment usage count
    await ListeningTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });

    return test;
};

// Get listening test for exam (without answers)
const getListeningTestForExam = async (testNumber: number) => {
    const test = await ListeningTest.findOne({ testNumber, isActive: true })
        .select("-sections.questions.correctAnswer -sections.questions.acceptableAnswers -sections.questions.explanation")
        .lean();

    if (!test) {
        throw new Error(`Listening Test #${testNumber} not found or inactive`);
    }

    return test;
};

// Get answers for grading
const getAnswersForGrading = async (testNumber: number) => {
    const test = await ListeningTest.findOne({ testNumber })
        .select("sections.questions.questionNumber sections.questions.correctAnswer sections.questions.acceptableAnswers")
        .lean();

    if (!test) {
        throw new Error("Listening test not found");
    }

    // Build answer map
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

    return answerMap;
};

// Grade student answers
const gradeListeningAnswers = async (
    testNumber: number,
    studentAnswers: Record<number, string>
) => {
    const answerMap = await getAnswersForGrading(testNumber);

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

        // Normalize answers for comparison
        const normalizeAnswer = (ans: string) =>
            ans?.toLowerCase().trim().replace(/[.,!?]/g, "");

        const studentNormalized = normalizeAnswer(studentAnswer);

        // Check if answer matches correct answer(s)
        let isCorrect = false;

        if (Array.isArray(correctData.correct)) {
            // For multiple correct answers
            isCorrect = correctData.correct.some(ca =>
                normalizeAnswer(ca) === studentNormalized
            );
        } else {
            isCorrect = normalizeAnswer(correctData.correct) === studentNormalized;
        }

        // Check acceptable answers if not correct
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

    const bandScore = getListeningBandScore(correctCount);

    return {
        correctCount,
        totalQuestions: Object.keys(answerMap).length,
        bandScore,
        results
    };
};

// Update listening test
const updateListeningTest = async (
    id: string,
    updateData: Partial<ICreateListeningTestInput>
) => {
    const test = await ListeningTest.findById(id);
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
        (updateData as any).totalQuestions = totalQuestions;
        (updateData as any).totalMarks = totalMarks;
    }

    const updatedTest = await ListeningTest.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedTest;
};

// Delete listening test (soft delete)
const deleteListeningTest = async (id: string) => {
    const test = await ListeningTest.findById(id);
    if (!test) {
        throw new Error("Listening test not found");
    }

    await ListeningTest.findByIdAndUpdate(id, { isActive: false });

    return { message: "Listening test deactivated successfully" };
};

// Toggle active status
const toggleActive = async (id: string) => {
    const test = await ListeningTest.findById(id);
    if (!test) {
        throw new Error("Listening test not found");
    }

    test.isActive = !test.isActive;
    await test.save();

    return {
        message: `Listening test ${test.isActive ? "activated" : "deactivated"} successfully`,
        isActive: test.isActive,
    };
};

// Get test summary for dropdown
const getTestSummary = async () => {
    const tests = await ListeningTest.find({ isActive: true })
        .select("testId testNumber title difficulty usageCount source")
        .sort({ testNumber: 1 })
        .lean();

    return tests;
};

// Get statistics
const getStatistics = async () => {
    const [total, active, totalUsage, byDifficulty] = await Promise.all([
        ListeningTest.countDocuments({}),
        ListeningTest.countDocuments({ isActive: true }),
        ListeningTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
        ListeningTest.aggregate([
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

export const ListeningService = {
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
