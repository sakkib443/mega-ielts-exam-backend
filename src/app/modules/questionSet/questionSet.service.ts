import { QuestionSet, generateSetId } from "./questionSet.model";
import {
    ICreateQuestionSetInput,
    IQuestionSetFilters,
    SetType,
} from "./questionSet.interface";
import { Types } from "mongoose";

// Import new separate collections
import { ListeningTest } from "../listening/listening.model";
import { ReadingTest } from "../reading/reading.model";
import { WritingTest } from "../writing/writing.model";


const createQuestionSet = async (
    data: ICreateQuestionSetInput,
    adminId: string
) => {
    // Generate set ID and number
    const { setId, setNumber } = await generateSetId(data.setType);

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
    } else if (data.writingTasks && data.writingTasks.length > 0) {
        totalQuestions = data.writingTasks.length;
        totalMarks = 18; // Writing is scored differently
    }

    const questionSet = await QuestionSet.create({
        ...data,
        setId,
        setNumber,
        totalQuestions,
        totalMarks,
        createdBy: new Types.ObjectId(adminId),
    });

    return questionSet;
};

// Get all question sets with filters - NOW USES NEW COLLECTIONS
const getAllQuestionSets = async (
    filters: IQuestionSetFilters,
    page: number = 1,
    limit: number = 10
) => {
    const skip = (page - 1) * limit;

    // Helper to build query for each collection
    const buildQuery = (isActive?: boolean, difficulty?: string, searchTerm?: string) => {
        const q: Record<string, unknown> = {};
        if (typeof isActive === "boolean") q.isActive = isActive;
        if (difficulty) q.difficulty = difficulty;
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

        let sets: any[] = [];
        let total = 0;

        if (filters.setType === "LISTENING") {
            [sets, total] = await Promise.all([
                ListeningTest.find(query)
                    .select("-sections.questions.correctAnswer")
                    .sort({ testNumber: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                ListeningTest.countDocuments(query),
            ]);
            // Map to old format
            sets = sets.map(s => ({
                ...s,
                setId: s.testId,
                setNumber: s.testNumber,
                setType: "LISTENING",
            }));
        } else if (filters.setType === "READING") {
            [sets, total] = await Promise.all([
                ReadingTest.find(query)
                    .select("-passages.questionGroups.questions.correctAnswer")
                    .sort({ testNumber: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                ReadingTest.countDocuments(query),
            ]);
            sets = sets.map(s => ({
                ...s,
                setId: s.testId,
                setNumber: s.testNumber,
                setType: "READING",
            }));
        } else if (filters.setType === "WRITING") {
            [sets, total] = await Promise.all([
                WritingTest.find(query)
                    .select("-tasks.sampleAnswer")
                    .sort({ testNumber: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                WritingTest.countDocuments(query),
            ]);
            sets = sets.map(s => ({
                ...s,
                setId: s.testId,
                setNumber: s.testNumber,
                setType: "WRITING",
            }));
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
    const [listeningTests, readingTests, writingTests] = await Promise.all([
        ListeningTest.find(query)
            .select("-sections.questions.correctAnswer")
            .sort({ testNumber: 1 })
            .lean(),
        ReadingTest.find(query)
            .select("-passages.questionGroups.questions.correctAnswer")
            .sort({ testNumber: 1 })
            .lean(),
        WritingTest.find(query)
            .select("-tasks.sampleAnswer")
            .sort({ testNumber: 1 })
            .lean(),
    ]);

    // Map to old format and combine
    const allSets = [
        ...listeningTests.map(s => ({
            ...s,
            setId: s.testId,
            setNumber: s.testNumber,
            setType: "LISTENING" as const,
        })),
        ...readingTests.map(s => ({
            ...s,
            setId: s.testId,
            setNumber: s.testNumber,
            setType: "READING" as const,
        })),
        ...writingTests.map(s => ({
            ...s,
            setId: s.testId,
            setNumber: s.testNumber,
            setType: "WRITING" as const,
        })),
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
};

// Get question set by ID (with answers for admin) - NOW USES NEW COLLECTIONS
const getQuestionSetById = async (id: string, includeAnswers: boolean = false) => {
    // Try to find in new collections first by MongoDB _id
    let set: any = null;
    let setType: string = "";

    // Try Listening
    set = includeAnswers
        ? await ListeningTest.findById(id).lean()
        : await ListeningTest.findById(id).select("-sections.questions.correctAnswer").lean();
    if (set) {
        setType = "LISTENING";
    }

    // Try Reading if not found
    if (!set) {
        set = includeAnswers
            ? await ReadingTest.findById(id).lean()
            : await ReadingTest.findById(id).select("-passages.questionGroups.questions.correctAnswer").lean();
        if (set) {
            setType = "READING";
        }
    }

    // Try Writing if not found
    if (!set) {
        set = includeAnswers
            ? await WritingTest.findById(id).lean()
            : await WritingTest.findById(id).select("-tasks.sampleAnswer").lean();
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
            ? await QuestionSet.findById(id).select(selectFields).lean()
            : await QuestionSet.findById(id).lean();
    }

    if (!set) {
        throw new Error("Question set not found");
    }

    // Map to old format if from new collection
    if (setType === "LISTENING") {
        return {
            ...set,
            setId: set.testId,
            setNumber: set.testNumber,
            setType: "LISTENING",
        };
    }

    if (setType === "READING") {
        return {
            ...set,
            setId: set.testId,
            setNumber: set.testNumber,
            setType: "READING",
        };
    }

    if (setType === "WRITING") {
        // Map tasks to writingTasks format for frontend compatibility
        const writingTasks = set.tasks?.map((task: any) => ({
            taskNumber: task.taskNumber,
            taskType: task.taskType,
            prompt: task.prompt,
            instructions: task.instructions,
            minWords: task.minWords,
            recommendedTime: task.recommendedTime,
            imageUrl: task.images?.[0]?.url || "",
            sampleAnswer: task.sampleAnswer,
            keyPoints: task.keyPoints,
        })) || [];

        return {
            ...set,
            setId: set.testId,
            setNumber: set.testNumber,
            setType: "WRITING",
            writingTasks,
        };
    }

    return set;
};

// Get question set by set number and type
const getQuestionSetByNumber = async (
    setType: SetType,
    setNumber: number,
    includeAnswers: boolean = false
) => {
    const selectFields = includeAnswers
        ? undefined
        : "-sections.questions.correctAnswer -writingTasks.sampleAnswer";

    const set = selectFields
        ? await QuestionSet.findOne({ setType, setNumber, isActive: true }).select(selectFields).lean()
        : await QuestionSet.findOne({ setType, setNumber, isActive: true }).lean();

    if (!set) {
        throw new Error(`${setType} Set #${setNumber} not found`);
    }

    // Increment usage count
    if (set._id) {
        await QuestionSet.findByIdAndUpdate(set._id, { $inc: { usageCount: 1 } });
    }

    return set;
};

// Get question set for exam (without answers) - NOW USES NEW COLLECTIONS
const getQuestionSetForExam = async (setType: SetType, setNumber: number) => {
    let data: any = null;

    if (setType === "LISTENING") {
        const test = await ListeningTest.findOne({ testNumber: setNumber, isActive: true })
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
            await ListeningTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
        }
    } else if (setType === "READING") {
        const test = await ReadingTest.findOne({ testNumber: setNumber, isActive: true })
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
            await ReadingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
        }
    } else if (setType === "WRITING") {
        const test = await WritingTest.findOne({ testNumber: setNumber, isActive: true })
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
                writingTasks: test.tasks?.map((task: any) => ({
                    taskNumber: task.taskNumber,
                    prompt: task.prompt,
                    instructions: task.instructions,
                    minWords: task.minWords,
                    recommendedTime: task.recommendedTime,
                    imageUrl: task.images?.[0]?.url,
                    letterContext: task.letterContext
                })),
                totalQuestions: 2,
                totalMarks: 18,
                duration: test.duration,
                difficulty: test.difficulty,
                isActive: test.isActive
            };
            await WritingTest.findByIdAndUpdate(test._id, { $inc: { usageCount: 1 } });
        }
    }

    if (!data) {
        // Fallback to old collection
        const set = await QuestionSet.findOne({ setType, setNumber, isActive: true })
            .select("-sections.questions.correctAnswer -writingTasks.sampleAnswer")
            .lean();

        if (!set) {
            throw new Error(`${setType} Set #${setNumber} not found or inactive`);
        }
        return set;
    }

    return data;
};

// Get answers for grading - NOW USES NEW COLLECTIONS
const getAnswersForGrading = async (setType: SetType, setNumber: number) => {
    const answerMap: Record<number, string | string[]> = {};

    if (setType === "LISTENING") {
        const test = await ListeningTest.findOne({ testNumber: setNumber })
            .select("sections.questions.correctAnswer")
            .lean();

        if (test?.sections) {
            let globalCounter = 0;
            test.sections.forEach((section: any) => {
                section.questions?.forEach((q: any) => {
                    globalCounter++;
                    answerMap[globalCounter] = q.correctAnswer;
                });
            });
            return answerMap;
        }
    } else if (setType === "READING") {
        const test = await ReadingTest.findOne({ testNumber: setNumber }).lean();

        // Reading tests can have either 'sections' or 'passages' structure
        const passagesOrSections = (test as any)?.passages || test?.sections;

        if (passagesOrSections) {
            let globalCounter = 0;
            passagesOrSections.forEach((passage: any) => {
                // Get answers from direct questions array
                passage.questions?.forEach((q: any) => {
                    globalCounter++;
                    answerMap[globalCounter] = q.correctAnswer;
                });

                // Extract answers from questionGroups
                passage.questionGroups?.forEach((group: any) => {
                    // Questions are directly in questionGroups[].questions[] array
                    group.questions?.forEach((q: any) => {
                        globalCounter++;
                        answerMap[globalCounter] = q.correctAnswer;
                    });

                    // Also check nested structures
                    // notesSections with bullets
                    if (group.notesSections) {
                        group.notesSections.forEach((noteSection: any) => {
                            noteSection.bullets?.forEach((bullet: any) => {
                                if (bullet.type !== "context" && bullet.correctAnswer) {
                                    globalCounter++;
                                    answerMap[globalCounter] = bullet.correctAnswer;
                                }
                            });
                        });
                    }

                    // statements array
                    if (group.statements) {
                        group.statements.forEach((stmt: any) => {
                            globalCounter++;
                            answerMap[globalCounter] = stmt.correctAnswer;
                        });
                    }

                    // matchingItems array
                    if (group.matchingItems) {
                        group.matchingItems.forEach((item: any) => {
                            globalCounter++;
                            answerMap[globalCounter] = item.correctAnswer;
                        });
                    }

                    // summarySegments
                    if (group.summarySegments) {
                        group.summarySegments.forEach((segment: any) => {
                            if (segment.type === "blank" && segment.correctAnswer) {
                                globalCounter++;
                                answerMap[globalCounter] = segment.correctAnswer;
                            }
                        });
                    }

                    // questionSets (choose-two-letters)
                    if (group.questionSets) {
                        group.questionSets.forEach((qSet: any) => {
                            qSet.correctAnswers?.forEach((ans: string) => {
                                globalCounter++;
                                answerMap[globalCounter] = ans;
                            });
                        });
                    }

                    // mcQuestions (multiple-choice-full)
                    if (group.mcQuestions) {
                        group.mcQuestions.forEach((mcQ: any) => {
                            globalCounter++;
                            answerMap[globalCounter] = mcQ.correctAnswer;
                        });
                    }
                });
            });

            console.log(`[getAnswersForGrading] READING Set ${setNumber}: Found ${Object.keys(answerMap).length} answers`);
            return answerMap;
        }
    }


    // Fallback to old collection
    const set = await QuestionSet.findOne({ setType, setNumber })
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
};


// Update question set - NOW USES NEW COLLECTIONS
const updateQuestionSet = async (
    id: string,
    updateData: Partial<ICreateQuestionSetInput>
) => {
    // Try to find in new collections first
    let set: any = null;
    let setType: string = "";

    // Try Listening
    set = await ListeningTest.findById(id);
    if (set) {
        setType = "LISTENING";
    }

    // Try Reading if not found
    if (!set) {
        set = await ReadingTest.findById(id);
        if (set) {
            setType = "READING";
        }
    }

    // Try Writing if not found
    if (!set) {
        set = await WritingTest.findById(id);
        if (set) {
            setType = "WRITING";
        }
    }

    // If found in new collections, update there
    if (set && setType) {
        // Prepare update data based on set type
        const updatePayload: any = {};

        // Common fields
        if (updateData.title) updatePayload.title = updateData.title;
        if (updateData.description) updatePayload.description = updateData.description;
        if (updateData.duration) updatePayload.duration = updateData.duration;
        if (updateData.difficulty) updatePayload.difficulty = updateData.difficulty;

        // Listening specific
        if (setType === "LISTENING") {
            if ((updateData as any).mainAudioUrl !== undefined) {
                updatePayload.mainAudioUrl = (updateData as any).mainAudioUrl;
            }
            if ((updateData as any).audioDuration !== undefined) {
                updatePayload.audioDuration = (updateData as any).audioDuration;
            }
            if (updateData.sections) {
                updatePayload.sections = updateData.sections;
                // Recalculate totals
                let totalQuestions = 0;
                let totalMarks = 0;
                updateData.sections.forEach((section) => {
                    totalQuestions += section.questions?.length || 0;
                    section.questions?.forEach((q) => {
                        totalMarks += q.marks || 1;
                    });
                });
                updatePayload.totalQuestions = totalQuestions;
                updatePayload.totalMarks = totalMarks;
            }

            const updatedSet = await ListeningTest.findByIdAndUpdate(
                id,
                { $set: updatePayload },
                { new: true, runValidators: true }
            );
            return {
                ...updatedSet?.toObject(),
                setId: updatedSet?.testId,
                setNumber: updatedSet?.testNumber,
                setType: "LISTENING",
            };
        }

        // Reading specific
        if (setType === "READING") {
            if (updateData.sections) {
                updatePayload.sections = updateData.sections;
                let totalQuestions = 0;
                let totalMarks = 0;
                updateData.sections.forEach((section) => {
                    totalQuestions += section.questions?.length || 0;
                    section.questions?.forEach((q) => {
                        totalMarks += q.marks || 1;
                    });
                });
                updatePayload.totalQuestions = totalQuestions;
                updatePayload.totalMarks = totalMarks;
            }

            const updatedSet = await ReadingTest.findByIdAndUpdate(
                id,
                { $set: updatePayload },
                { new: true, runValidators: true }
            );
            return {
                ...updatedSet?.toObject(),
                setId: updatedSet?.testId,
                setNumber: updatedSet?.testNumber,
                setType: "READING",
            };
        }

        // Writing specific
        if (setType === "WRITING") {
            if ((updateData as any).writingTasks) {
                // Get existing tasks to preserve taskType and subType
                const existingTasks = set.tasks || [];

                updatePayload.tasks = (updateData as any).writingTasks.map((task: any, index: number) => {
                    const existingTask = existingTasks[index] || {};
                    return {
                        taskNumber: task.taskNumber,
                        // Preserve existing taskType or use correct default
                        taskType: existingTask.taskType || (task.taskNumber === 1 ? "task1-academic" : "task2"),
                        // Preserve existing subType or use correct default
                        subType: existingTask.subType || (task.taskNumber === 1 ? "line-graph" : "opinion"),
                        prompt: task.prompt || existingTask.prompt || "",
                        instructions: task.instructions || existingTask.instructions || "Write your response.",
                        minWords: task.minWords || existingTask.minWords || (task.taskNumber === 1 ? 150 : 250),
                        recommendedTime: task.recommendedTime || existingTask.recommendedTime || (task.taskNumber === 1 ? 20 : 40),
                        images: task.imageUrl ? [{ url: task.imageUrl, description: "Task image" }] : (existingTask.images || []),
                        // Preserve other existing fields
                        keyPoints: existingTask.keyPoints || [],
                        sampleAnswer: existingTask.sampleAnswer || "",
                        bandDescriptors: existingTask.bandDescriptors || [],
                        examinerTips: existingTask.examinerTips || [],
                    };
                });
            }

            const updatedSet = await WritingTest.findByIdAndUpdate(
                id,
                { $set: updatePayload },
                { new: true, runValidators: true }
            );
            return {
                ...updatedSet?.toObject(),
                setId: updatedSet?.testId,
                setNumber: updatedSet?.testNumber,
                setType: "WRITING",
            };
        }
    }

    // Fallback to old collection
    const oldSet = await QuestionSet.findById(id);
    if (!oldSet) {
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
        (updateData as any).totalQuestions = totalQuestions;
        (updateData as any).totalMarks = totalMarks;
    }

    const updatedSet = await QuestionSet.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedSet;
};

// Delete question set - NOW SUPPORTS PERMANENT DELETION
const deleteQuestionSet = async (id: string) => {
    // Try to find and delete in new collections first
    let result = await ListeningTest.findByIdAndDelete(id);
    if (result) {
        return { message: "Listening test deleted permanently" };
    }

    result = await ReadingTest.findByIdAndDelete(id);
    if (result) {
        return { message: "Reading test deleted permanently" };
    }

    result = await WritingTest.findByIdAndDelete(id);
    if (result) {
        return { message: "Writing test deleted permanently" };
    }

    // Fallback to old collection
    result = await QuestionSet.findByIdAndDelete(id);
    if (!result) {
        throw new Error("Question set not found");
    }

    return { message: "Question set deleted permanently" };
};

// Toggle active status - NOW USES NEW COLLECTIONS
const toggleActive = async (id: string) => {
    // Try to find in new collections first
    let set: any = await ListeningTest.findById(id);
    if (set) {
        set.isActive = !set.isActive;
        await set.save();
        return {
            message: `Listening test ${set.isActive ? "activated" : "deactivated"} successfully`,
            isActive: set.isActive,
        };
    }

    set = await ReadingTest.findById(id);
    if (set) {
        set.isActive = !set.isActive;
        await set.save();
        return {
            message: `Reading test ${set.isActive ? "activated" : "deactivated"} successfully`,
            isActive: set.isActive,
        };
    }

    set = await WritingTest.findById(id);
    if (set) {
        set.isActive = !set.isActive;
        await set.save();
        return {
            message: `Writing test ${set.isActive ? "activated" : "deactivated"} successfully`,
            isActive: set.isActive,
        };
    }

    // Fallback to old collection
    set = await QuestionSet.findById(id);
    if (!set) {
        throw new Error("Question set not found");
    }

    set.isActive = !set.isActive;
    await set.save();

    return {
        message: `Question set ${set.isActive ? "activated" : "deactivated"} successfully`,
        isActive: set.isActive,
    };
};

// Get set summary (for dropdown selection) - NOW USES NEW COLLECTIONS
const getSetSummary = async (setType: SetType) => {
    let sets: any[] = [];

    if (setType === "LISTENING") {
        const tests = await ListeningTest.find({ isActive: true })
            .select("_id testId testNumber title difficulty usageCount")
            .sort({ testNumber: 1 })
            .lean();
        sets = tests.map(t => ({
            _id: t._id,
            setId: t.testId,
            setNumber: t.testNumber,
            title: t.title,
            difficulty: t.difficulty,
            usageCount: t.usageCount
        }));
    } else if (setType === "READING") {
        const tests = await ReadingTest.find({ isActive: true })
            .select("_id testId testNumber title difficulty usageCount")
            .sort({ testNumber: 1 })
            .lean();
        sets = tests.map(t => ({
            _id: t._id,
            setId: t.testId,
            setNumber: t.testNumber,
            title: t.title,
            difficulty: t.difficulty,
            usageCount: t.usageCount
        }));
    } else if (setType === "WRITING") {
        const tests = await WritingTest.find({ isActive: true })
            .select("_id testId testNumber title difficulty usageCount")
            .sort({ testNumber: 1 })
            .lean();
        sets = tests.map(t => ({
            _id: t._id,
            setId: t.testId,
            setNumber: t.testNumber,
            title: t.title,
            difficulty: t.difficulty,
            usageCount: t.usageCount
        }));
    }

    // Fallback to old collection
    if (sets.length === 0) {
        sets = await QuestionSet.find({ setType, isActive: true })
            .select("setId setNumber title difficulty usageCount")
            .sort({ setNumber: 1 })
            .lean();
    }

    return sets;
};

// Get statistics - NOW USES NEW COLLECTIONS
const getStatistics = async () => {
    const [listeningCount, readingCount, writingCount, listeningUsage, readingUsage, writingUsage] = await Promise.all([
        ListeningTest.countDocuments({ isActive: true }),
        ReadingTest.countDocuments({ isActive: true }),
        WritingTest.countDocuments({ isActive: true }),
        ListeningTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
        ReadingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
        WritingTest.aggregate([
            { $group: { _id: null, total: { $sum: "$usageCount" } } },
        ]),
    ]);

    const totalUsage =
        (listeningUsage[0]?.total || 0) +
        (readingUsage[0]?.total || 0) +
        (writingUsage[0]?.total || 0);

    return {
        listening: listeningCount,
        reading: readingCount,
        writing: writingCount,
        totalUsage,
    };
};

export const QuestionSetService = {
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
