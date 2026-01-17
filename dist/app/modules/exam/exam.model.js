"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exam = void 0;
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    questionNumber: { type: Number, required: true },
    questionType: {
        type: String,
        enum: [
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
        ],
        required: true,
    },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: mongoose_1.Schema.Types.Mixed, required: true },
    audioTimestamp: { type: String },
    passage: { type: String },
    imageUrl: { type: String },
}, { _id: false });
const sectionSchema = new mongoose_1.Schema({
    sectionNumber: { type: Number, required: true },
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    audioUrl: { type: String },
    passage: { type: String },
    questions: [questionSchema],
}, { _id: false });
const writingTaskSchema = new mongoose_1.Schema({
    taskNumber: { type: Number, required: true },
    taskType: { type: String, enum: ["task1", "task2"], required: true },
    prompt: { type: String, required: true },
    imageUrl: { type: String },
    minWords: { type: Number, required: true },
}, { _id: false });
const examSchema = new mongoose_1.Schema({
    examId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: [true, "Exam title is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    listening: {
        sections: [sectionSchema],
        duration: { type: Number, default: 40 },
        totalQuestions: { type: Number, default: 40 },
    },
    reading: {
        sections: [sectionSchema],
        duration: { type: Number, default: 60 },
        totalQuestions: { type: Number, default: 40 },
    },
    writing: {
        tasks: [writingTaskSchema],
        duration: { type: Number, default: 60 },
    },
    speaking: {
        parts: [{ type: mongoose_1.Schema.Types.Mixed }],
        duration: { type: Number, default: 15 },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
exports.Exam = (0, mongoose_1.model)("Exam", examSchema);
