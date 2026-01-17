"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExamValidation = exports.createExamValidation = void 0;
const zod_1 = require("zod");
const questionSchema = zod_1.z.object({
    questionNumber: zod_1.z.number(),
    questionType: zod_1.z.enum([
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
    questionText: zod_1.z.string(),
    options: zod_1.z.array(zod_1.z.string()).optional(),
    correctAnswer: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
    audioTimestamp: zod_1.z.string().optional(),
    passage: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
});
const sectionSchema = zod_1.z.object({
    sectionNumber: zod_1.z.number(),
    title: zod_1.z.string(),
    instructions: zod_1.z.string(),
    audioUrl: zod_1.z.string().optional(),
    passage: zod_1.z.string().optional(),
    questions: zod_1.z.array(questionSchema),
});
const writingTaskSchema = zod_1.z.object({
    taskNumber: zod_1.z.number(),
    taskType: zod_1.z.enum(["task1", "task2"]),
    prompt: zod_1.z.string(),
    imageUrl: zod_1.z.string().optional(),
    minWords: zod_1.z.number(),
});
exports.createExamValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
        description: zod_1.z.string().optional(),
        listening: zod_1.z.object({
            sections: zod_1.z.array(sectionSchema),
            duration: zod_1.z.number().default(40),
            totalQuestions: zod_1.z.number().default(40),
        }),
        reading: zod_1.z.object({
            sections: zod_1.z.array(sectionSchema),
            duration: zod_1.z.number().default(60),
            totalQuestions: zod_1.z.number().default(40),
        }),
        writing: zod_1.z.object({
            tasks: zod_1.z.array(writingTaskSchema),
            duration: zod_1.z.number().default(60),
        }),
    }),
});
exports.updateExamValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().optional(),
        listening: zod_1.z
            .object({
            sections: zod_1.z.array(sectionSchema),
            duration: zod_1.z.number(),
            totalQuestions: zod_1.z.number(),
        })
            .optional(),
        reading: zod_1.z
            .object({
            sections: zod_1.z.array(sectionSchema),
            duration: zod_1.z.number(),
            totalQuestions: zod_1.z.number(),
        })
            .optional(),
        writing: zod_1.z
            .object({
            tasks: zod_1.z.array(writingTaskSchema),
            duration: zod_1.z.number(),
        })
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
