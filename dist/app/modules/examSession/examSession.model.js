"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSession = void 0;
const mongoose_1 = require("mongoose");
const examUserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    nid: { type: String, required: true },
}, { _id: false });
const answerSchema = new mongoose_1.Schema({
    questionNumber: { type: Number, required: true },
    answer: { type: mongoose_1.Schema.Types.Mixed, required: true },
}, { _id: false });
const examSessionSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.ExamSession = (0, mongoose_1.model)("ExamSession", examSessionSchema);
