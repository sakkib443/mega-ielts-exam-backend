import { z } from "zod";

// Create student validation
const createStudentSchema = z.object({
    body: z.object({
        nameEnglish: z
            .string({ message: "Name in English is required" })
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),
        nameBengali: z
            .string()
            .max(100, "Bengali name must not exceed 100 characters")
            .optional(),
        email: z
            .string({ message: "Email is required" })
            .email("Invalid email format"),
        phone: z
            .string({ message: "Phone number is required" })
            .regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number (e.g., 01712345678)"),
        nidNumber: z
            .string()
            .regex(/^\d{10}$|^\d{17}$/, "NID must be 10 or 17 digits")
            .optional(),
        photo: z.string().url("Photo must be a valid URL").optional(),
        paymentStatus: z.enum(["pending", "paid", "refunded"], {
            message: "Payment status is required",
        }),
        paymentAmount: z
            .number({ message: "Payment amount is required" })
            .min(0, "Payment amount must be positive"),
        paymentMethod: z.enum(["cash", "bkash", "nagad", "bank", "other"], {
            message: "Payment method is required",
        }),
        paymentDate: z.string().datetime().optional(),
        paymentReference: z.string().optional(),
        examDate: z
            .string({ message: "Exam date is required" })
            .datetime("Invalid date format"),
        listeningSetNumber: z.number().int().min(1).max(10000).optional(),
        readingSetNumber: z.number().int().min(1).max(10000).optional(),
        writingSetNumber: z.number().int().min(1).max(10000).optional(),
    }),
});

// Update student validation
const updateStudentSchema = z.object({
    body: z.object({
        nameEnglish: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters")
            .optional(),
        nameBengali: z
            .string()
            .max(100, "Bengali name must not exceed 100 characters")
            .optional(),
        phone: z
            .string()
            .regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number")
            .optional(),
        nidNumber: z
            .string()
            .regex(/^\d{10}$|^\d{17}$/, "NID must be 10 or 17 digits")
            .optional(),
        photo: z.string().url("Photo must be a valid URL").optional(),
        paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
        paymentAmount: z.number().min(0, "Payment amount must be positive").optional(),
        paymentMethod: z.enum(["cash", "bkash", "nagad", "bank", "other"]).optional(),
        paymentDate: z.string().datetime().optional(),
        paymentReference: z.string().optional(),
        examDate: z.string().datetime().optional(),
        listeningSetNumber: z.number().int().min(1).max(10000).optional(),
        readingSetNumber: z.number().int().min(1).max(10000).optional(),
        writingSetNumber: z.number().int().min(1).max(10000).optional(),
        isActive: z.boolean().optional(),
        canRetake: z.boolean().optional(),
    }),
});

// Verify exam ID validation
const verifyExamIdSchema = z.object({
    body: z.object({
        examId: z
            .string({ message: "Exam ID is required" })
            .regex(
                /^BACIELTS\d{6}$/,
                "Invalid Exam ID format (e.g., BACIELTS260001)"
            ),
    }),
});

// Start exam validation
const startExamSchema = z.object({
    body: z.object({
        examId: z
            .string({ message: "Exam ID is required" })
            .regex(/^BACIELTS\d{6}$/, "Invalid Exam ID format"),
        ipAddress: z.string().optional(),
        browserFingerprint: z.string().optional(),
    }),
});

// Report violation validation
const reportViolationSchema = z.object({
    body: z.object({
        examId: z.string({ message: "Exam ID is required" }),
        type: z.enum([
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
const submitExamSchema = z.object({
    body: z.object({
        examId: z.string({ message: "Exam ID is required" }),
        answers: z.object({
            listening: z.array(
                z.object({
                    questionNumber: z.number(),
                    answer: z.union([z.string(), z.array(z.string())]),
                })
            ).optional(),
            reading: z.array(
                z.object({
                    questionNumber: z.number(),
                    answer: z.union([z.string(), z.array(z.string())]),
                })
            ).optional(),
            writing: z.object({
                task1: z.string().optional(),
                task2: z.string().optional(),
            }).optional(),
        }),
    }),
});

// Reset exam validation (admin only)
const resetExamSchema = z.object({
    params: z.object({
        examId: z.string(),
    }),
});

export const StudentValidation = {
    createStudentSchema,
    updateStudentSchema,
    verifyExamIdSchema,
    startExamSchema,
    reportViolationSchema,
    submitExamSchema,
    resetExamSchema,
};
