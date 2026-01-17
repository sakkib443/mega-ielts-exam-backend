import { z } from "zod";

export const startExamValidation = z.object({
    body: z.object({
        examId: z.string().min(1, "Exam ID is required"),
        name: z.string().min(2, "Name must be at least 2 characters"),
        phone: z.string().min(10, "Phone must be at least 10 digits"),
        nid: z.string().min(10, "NID must be at least 10 characters"),
    }),
});

export const submitAnswersValidation = z.object({
    body: z.object({
        section: z.enum(["listening", "reading", "writing"]),
        answers: z.union([
            z.array(
                z.object({
                    questionNumber: z.number(),
                    answer: z.union([z.string(), z.array(z.string())]),
                })
            ),
            z.object({
                task1: z.string().optional(),
                task2: z.string().optional(),
            }),
        ]),
    }),
});

export const accessSessionValidation = z.object({
    params: z.object({
        sessionId: z.string().min(1, "Session ID is required"),
    }),
});
