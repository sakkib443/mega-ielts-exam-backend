import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IStudent, IAssignedSets, IExamScores, IViolation } from "./student.interface";
import config from "../../config";

// Assigned sets sub-schema
const assignedSetsSchema = new Schema<IAssignedSets>(
    {
        listeningSetId: { type: Schema.Types.ObjectId, ref: "QuestionSet" },
        listeningSetNumber: { type: Number },
        readingSetId: { type: Schema.Types.ObjectId, ref: "QuestionSet" },
        readingSetNumber: { type: Number },
        writingSetId: { type: Schema.Types.ObjectId, ref: "QuestionSet" },
        writingSetNumber: { type: Number },
    },
    { _id: false }
);

// Exam scores sub-schema
const examScoresSchema = new Schema<IExamScores>(
    {
        listening: {
            raw: { type: Number, default: 0 },
            band: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            totalQuestions: { type: Number, default: 40 },
        },
        reading: {
            raw: { type: Number, default: 0 },
            band: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            totalQuestions: { type: Number, default: 40 },
        },
        writing: {
            task1Band: { type: Number, default: 0 },
            task2Band: { type: Number, default: 0 },
            overallBand: { type: Number, default: 0 },
        },
        overall: { type: Number, default: 0 },
    },
    { _id: false }
);

// Violation sub-schema
const violationSchema = new Schema<IViolation>(
    {
        type: {
            type: String,
            enum: ["tab-switch", "fullscreen-exit", "browser-close", "refresh", "dev-tools", "other"],
            required: true,
        },
        timestamp: { type: Date, default: Date.now },
        count: { type: Number, default: 1 },
        action: {
            type: String,
            enum: ["warning", "deduction", "terminated"],
            default: "warning",
        },
    },
    { _id: false }
);

// Main Student Schema
const studentSchema = new Schema<IStudent>(
    {
        // Unique exam ID (BACIELTS260001 format)
        examId: {
            type: String,
            required: [true, "Exam ID is required"],
            unique: true,
            uppercase: true,
            trim: true,
        },

        // Personal information
        nameEnglish: {
            type: String,
            required: [true, "Name in English is required"],
            trim: true,
        },
        nameBengali: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        nidNumber: {
            type: String,
            required: [true, "NID/Voter ID is required"],
            trim: true,
        },
        photo: {
            type: String,
        },

        // Password (auto-generated)
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },

        // Payment information
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },
        paymentAmount: {
            type: Number,
            required: [true, "Payment amount is required"],
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "bkash", "nagad", "bank", "other"],
            required: [true, "Payment method is required"],
        },
        paymentDate: {
            type: Date,
        },
        paymentReference: {
            type: String,
        },

        // Exam assignment
        examDate: {
            type: Date,
            required: [true, "Exam date is required"],
        },
        assignedSets: {
            type: assignedSetsSchema,
            default: {},
        },

        // Exam session tracking
        examStatus: {
            type: String,
            enum: ["not-started", "in-progress", "completed", "terminated", "expired"],
            default: "not-started",
        },
        examSessionId: {
            type: String,
        },
        examStartedAt: {
            type: Date,
        },
        examCompletedAt: {
            type: Date,
        },

        // Exam scores
        scores: {
            type: examScoresSchema,
        },

        // Track completed modules
        completedModules: {
            type: [String],
            enum: ["listening", "reading", "writing"],
            default: [],
        },

        // Security & violations
        violations: {
            type: [violationSchema],
            default: [],
        },
        totalViolations: {
            type: Number,
            default: 0,
        },
        ipAddress: {
            type: String,
        },
        browserFingerprint: {
            type: String,
        },

        // Status flags
        isActive: {
            type: Boolean,
            default: true,
        },
        canRetake: {
            type: Boolean,
            default: false,
        },

        // Linked user account
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        // Created by (admin)
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
studentSchema.index({ examId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ phone: 1 });
studentSchema.index({ examStatus: 1 });
studentSchema.index({ paymentStatus: 1 });
studentSchema.index({ examDate: 1 });
studentSchema.index({ createdAt: -1 });

// Hash password before saving
studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, config.bcrypt_salt_rounds);
    next();
});

// Compare password method
studentSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to generate exam ID
studentSchema.statics.generateExamId = async function (): Promise<string> {
    const currentYear = new Date().getFullYear().toString().slice(-2); // "26" for 2026
    const prefix = `BACIELTS${currentYear}`;

    // Find the last student created this year
    const lastStudent = await this.findOne({
        examId: new RegExp(`^${prefix}`),
    })
        .sort({ examId: -1 })
        .limit(1);

    let nextNumber = 1;
    if (lastStudent) {
        const lastNumber = parseInt(lastStudent.examId.slice(-4), 10);
        nextNumber = lastNumber + 1;
    }

    // Format with leading zeros (4 digits)
    const serialNumber = nextNumber.toString().padStart(4, "0");
    return `${prefix}${serialNumber}`;
};

// Create the model with static methods
interface IStudentModel extends ReturnType<typeof model<IStudent>> {
    generateExamId(): Promise<string>;
}

export const Student = model<IStudent>("Student", studentSchema) as IStudentModel;
