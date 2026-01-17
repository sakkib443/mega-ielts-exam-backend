"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidation = void 0;
const zod_1 = require("zod");
// Create student validation
const createStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        nameEnglish: zod_1.z
            .string({ message: "Name in English is required" })
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),
        nameBengali: zod_1.z
            .string()
            .max(100, "Bengali name must not exceed 100 characters")
            .optional(),
        email: zod_1.z
            .string({ message: "Email is required" })
            .email("Invalid email format"),
        phone: zod_1.z
            .string({ message: "Phone number is required" })
            .regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number (e.g., 01712345678)"),
        nidNumber: zod_1.z
            .string({ message: "NID/Voter ID is required" })
            .regex(/^\d{10}$|^\d{17}$/, "NID must be 10 or 17 digits"),
        photo: zod_1.z.string().url("Photo must be a valid URL").optional(),
        paymentStatus: zod_1.z.enum(["pending", "paid", "refunded"], {
            message: "Payment status is required",
        }),
        paymentAmount: zod_1.z
            .number({ message: "Payment amount is required" })
            .min(0, "Payment amount must be positive"),
        paymentMethod: zod_1.z.enum(["cash", "bkash", "nagad", "bank", "other"], {
            message: "Payment method is required",
        }),
        paymentDate: zod_1.z.string().datetime().optional(),
        paymentReference: zod_1.z.string().optional(),
        examDate: zod_1.z
            .string({ message: "Exam date is required" })
            .datetime("Invalid date format"),
        listeningSetNumber: zod_1.z.number().int().min(1).max(100).optional(),
        readingSetNumber: zod_1.z.number().int().min(1).max(100).optional(),
        writingSetNumber: zod_1.z.number().int().min(1).max(100).optional(),
    }),
});
// Update student validation
const updateStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        nameEnglish: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters")
            .optional(),
        nameBengali: zod_1.z
            .string()
            .max(100, "Bengali name must not exceed 100 characters")
            .optional(),
        phone: zod_1.z
            .string()
            .regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number")
            .optional(),
        photo: zod_1.z.string().url("Photo must be a valid URL").optional(),
        paymentStatus: zod_1.z.enum(["pending", "paid", "refunded"]).optional(),
        paymentAmount: zod_1.z.number().min(0, "Payment amount must be positive").optional(),
        paymentMethod: zod_1.z.enum(["cash", "bkash", "nagad", "bank", "other"]).optional(),
        paymentDate: zod_1.z.string().datetime().optional(),
        paymentReference: zod_1.z.string().optional(),
        examDate: zod_1.z.string().datetime().optional(),
        listeningSetNumber: zod_1.z.number().int().min(1).max(100).optional(),
        readingSetNumber: zod_1.z.number().int().min(1).max(100).optional(),
        writingSetNumber: zod_1.z.number().int().min(1).max(100).optional(),
        isActive: zod_1.z.boolean().optional(),
        canRetake: zod_1.z.boolean().optional(),
    }),
});
// Verify exam ID validation
const verifyExamIdSchema = zod_1.z.object({
    body: zod_1.z.object({
        examId: zod_1.z
            .string({ message: "Exam ID is required" })
            .regex(/^BACIELTS\d{6}$/, "Invalid Exam ID format (e.g., BACIELTS260001)"),
    }),
});
// Start exam validation
const startExamSchema = zod_1.z.object({
    body: zod_1.z.object({
        examId: zod_1.z
            .string({ message: "Exam ID is required" })
            .regex(/^BACIELTS\d{6}$/, "Invalid Exam ID format"),
        ipAddress: zod_1.z.string().optional(),
        browserFingerprint: zod_1.z.string().optional(),
    }),
});
// Report violation validation
const reportViolationSchema = zod_1.z.object({
    body: zod_1.z.object({
        examId: zod_1.z.string({ message: "Exam ID is required" }),
        type: zod_1.z.enum([
            "tab-switch",
            "fullscreen-exit",
            "browser-close",
            "refresh",
            "dev-tools",
            "other",
        ]),
    }),
});
// Submit exam validation
const submitExamSchema = zod_1.z.object({
    body: zod_1.z.object({
        examId: zod_1.z.string({ message: "Exam ID is required" }),
        answers: zod_1.z.object({
            listening: zod_1.z.array(zod_1.z.object({
                questionNumber: zod_1.z.number(),
                answer: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
            })).optional(),
            reading: zod_1.z.array(zod_1.z.object({
                questionNumber: zod_1.z.number(),
                answer: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
            })).optional(),
            writing: zod_1.z.object({
                task1: zod_1.z.string().optional(),
                task2: zod_1.z.string().optional(),
            }).optional(),
        }),
    }),
});
// Reset exam validation (admin only)
const resetExamSchema = zod_1.z.object({
    params: zod_1.z.object({
        examId: zod_1.z.string(),
    }),
});
exports.StudentValidation = {
    createStudentSchema,
    updateStudentSchema,
    verifyExamIdSchema,
    startExamSchema,
    reportViolationSchema,
    submitExamSchema,
    resetExamSchema,
};
