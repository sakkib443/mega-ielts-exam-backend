import { z } from "zod";

const questionSchema = z.object({
    questionNumber: z.number(),
    questionType: z.enum([
        "multiple-choice",
        "matching",
        "form-completion",
        "note-completion",
        "sentence-completion",
        "summary-completion",
        "true-false-not-given",
        "yes-no-not-given",
        "short-answer",
        "diagram-labeling",
    ]),
    questionText: z.string(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]),
    audioTimestamp: z.string().optional(),
    passage: z.string().optional(),
    imageUrl: z.string().optional(),
});

const sectionSchema = z.object({
    sectionNumber: z.number(),
    title: z.string(),
    instructions: z.string(),
    audioUrl: z.string().optional(),
    passage: z.string().optional(),
    questions: z.array(questionSchema),
});

const writingTaskSchema = z.object({
    taskNumber: z.number(),
    taskType: z.enum(["task1", "task2"]),
    prompt: z.string(),
    imageUrl: z.string().optional(),
    minWords: z.number(),
});

export const createExamValidation = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        description: z.string().optional(),
        listening: z.object({
            sections: z.array(sectionSchema),
            duration: z.number().default(40),
            totalQuestions: z.number().default(40),
        }),
        reading: z.object({
            sections: z.array(sectionSchema),
            duration: z.number().default(60),
            totalQuestions: z.number().default(40),
        }),
        writing: z.object({
            tasks: z.array(writingTaskSchema),
            duration: z.number().default(60),
        }),
    }),
});

export const updateExamValidation = z.object({
    body: z.object({
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        listening: z
            .object({
                sections: z.array(sectionSchema),
                duration: z.number(),
                totalQuestions: z.number(),
            })
            .optional(),
        reading: z
            .object({
                sections: z.array(sectionSchema),
                duration: z.number(),
                totalQuestions: z.number(),
            })
            .optional(),
        writing: z
            .object({
                tasks: z.array(writingTaskSchema),
                duration: z.number(),
            })
            .optional(),
        isActive: z.boolean().optional(),
    }),
});
