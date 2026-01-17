"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessSessionValidation = exports.submitAnswersValidation = exports.startExamValidation = void 0;
const zod_1 = require("zod");
exports.startExamValidation = zod_1.z.object({
    body: zod_1.z.object({
        examId: zod_1.z.string().min(1, "Exam ID is required"),
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        phone: zod_1.z.string().min(10, "Phone must be at least 10 digits"),
        nid: zod_1.z.string().min(10, "NID must be at least 10 characters"),
    }),
});
exports.submitAnswersValidation = zod_1.z.object({
    body: zod_1.z.object({
        section: zod_1.z.enum(["listening", "reading", "writing"]),
        answers: zod_1.z.union([
            zod_1.z.array(zod_1.z.object({
                questionNumber: zod_1.z.number(),
                answer: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
            })),
            zod_1.z.object({
                task1: zod_1.z.string().optional(),
                task2: zod_1.z.string().optional(),
            }),
        ]),
    }),
});
exports.accessSessionValidation = zod_1.z.object({
    params: zod_1.z.object({
        sessionId: zod_1.z.string().min(1, "Session ID is required"),
    }),
});
