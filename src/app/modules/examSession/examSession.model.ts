import { Schema, model } from "mongoose";
import { IExamSession, IAnswer, IExamUser } from "./examSession.interface";

const examUserSchema = new Schema<IExamUser>(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        nid: { type: String, required: true },
    },
    { _id: false }
);

const answerSchema = new Schema<IAnswer>(
    {
        questionNumber: { type: Number, required: true },
        answer: { type: Schema.Types.Mixed, required: true },
    },
    { _id: false }
);

const examSessionSchema = new Schema<IExamSession>(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
        },
        examId: {
            type: String,
            required: true,
        },
        exam: {
            type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        user: {
            type: examUserSchema,
            required: true,
        },
        answers: {
            listening: [answerSchema],
            reading: [answerSchema],
            writing: {
                task1: { type: String, default: "" },
                task2: { type: String, default: "" },
            },
        },
        scores: {
            listening: {
                raw: { type: Number, default: 0 },
                band: { type: Number, default: 0 },
            },
            reading: {
                raw: { type: Number, default: 0 },
                band: { type: Number, default: 0 },
            },
            writing: {
                task1Band: { type: Number, default: 0 },
                task2Band: { type: Number, default: 0 },
                overallBand: { type: Number, default: 0 },
            },
            overall: { type: Number, default: 0 },
        },
        status: {
            type: String,
            enum: ["not-started", "in-progress", "completed"],
            default: "not-started",
        },
        currentSection: {
            type: String,
            enum: ["listening", "reading", "writing", "completed"],
            default: "listening",
        },
        startedAt: { type: Date },
        completedAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

export const ExamSession = model<IExamSession>("ExamSession", examSessionSchema);
