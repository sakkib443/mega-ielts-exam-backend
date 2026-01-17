"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSetId = exports.QuestionSet = void 0;
const mongoose_1 = require("mongoose");
// Question sub-schema
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
            "fill-in-blank",
        ],
        required: true,
    },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: mongoose_1.Schema.Types.Mixed, required: true },
    audioTimestamp: { type: String },
    imageUrl: { type: String },
    marks: { type: Number, default: 1 },
}, { _id: false });
// Section sub-schema
const sectionSchema = new mongoose_1.Schema({
    sectionNumber: { type: Number, required: true },
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    audioUrl: { type: String },
    passage: { type: String },
    imageUrl: { type: String },
    questions: [questionSchema],
}, { _id: false });
// Writing task sub-schema
const writingTaskSchema = new mongoose_1.Schema({
    taskNumber: { type: Number, required: true },
    taskType: { type: String, enum: ["task1", "task2"], required: true },
    // Task 1 specific (Visual data description)
    task1SubType: {
        type: String,
        enum: [
            "line-graph",
            "bar-chart",
            "pie-chart",
            "table",
            "map-comparison",
            "process-diagram",
            "mixed-charts",
            "diagram"
        ],
    },
    // Task 2 specific (Essay type)
    task2SubType: {
        type: String,
        enum: [
            "opinion",
            "discussion",
            "problem-solution",
            "advantages-disadvantages",
            "two-part-question",
            "direct-question"
        ],
    },
    // Main prompt
    prompt: { type: String, required: true },
    // Additional instructions
    instructions: { type: String },
    // Images (can have multiple for map comparisons)
    imageUrl: { type: String },
    imageUrls: [{ type: String }],
    imageDescriptions: [{ type: String }],
    // Word requirements
    minWords: { type: Number, required: true },
    recommendedTime: { type: Number },
    // Scoring criteria (percentages)
    scoringCriteria: {
        type: new mongoose_1.Schema({
            taskAchievement: { type: Number, default: 25 },
            coherenceCohesion: { type: Number, default: 25 },
            lexicalResource: { type: Number, default: 25 },
            grammaticalAccuracy: { type: Number, default: 25 },
        }, { _id: false }),
    },
    // Sample answer
    sampleAnswer: { type: String },
    // Key points to cover
    keyPoints: [{ type: String }],
    // Band descriptors
    bandDescriptors: [{
            band: { type: Number },
            description: { type: String },
        }],
}, { _id: false });
// Main QuestionSet schema
const questionSetSchema = new mongoose_1.Schema({
    setId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    setType: {
        type: String,
        enum: ["LISTENING", "READING", "WRITING"],
        required: true,
    },
    setNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    // For Listening/Reading
    sections: [sectionSchema],
    // For Writing
    writingTasks: [writingTaskSchema],
    // Audio
    mainAudioUrl: { type: String },
    audioDuration: { type: Number },
    // Metadata
    totalQuestions: {
        type: Number,
        required: true,
        default: 40,
    },
    totalMarks: {
        type: Number,
        required: true,
        default: 40,
    },
    duration: {
        type: Number,
        required: true,
        default: 40,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium",
    },
    // Status
    isActive: {
        type: Boolean,
        default: true,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    // Created by
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
// Indexes
questionSetSchema.index({ setType: 1, setNumber: 1 });
questionSetSchema.index({ setId: 1 });
questionSetSchema.index({ isActive: 1 });
// Create model with static methods
exports.QuestionSet = (0, mongoose_1.model)("QuestionSet", questionSetSchema);
// Helper function to generate set ID (instead of static method)
const generateSetId = (setType) => __awaiter(void 0, void 0, void 0, function* () {
    const lastSet = yield exports.QuestionSet.findOne({ setType })
        .sort({ setNumber: -1 })
        .limit(1);
    const nextNumber = lastSet ? lastSet.setNumber + 1 : 1;
    const paddedNumber = nextNumber.toString().padStart(3, "0");
    const setId = `${setType}_SET_${paddedNumber}`;
    return { setId, setNumber: nextNumber };
});
exports.generateSetId = generateSetId;
