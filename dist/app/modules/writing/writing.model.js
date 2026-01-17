"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.WritingSubmission = exports.WritingTest = exports.generateWritingTestId = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Image Schema
const ImageSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    description: { type: String, required: true },
    caption: { type: String }
});
// Letter Context Schema (for GT Task 1)
const LetterContextSchema = new mongoose_1.Schema({
    recipientType: {
        type: String,
        enum: ["friend", "employer", "official", "colleague"]
    },
    situation: { type: String },
    bulletPoints: [{ type: String }]
});
// Band Descriptor Schema
const BandDescriptorSchema = new mongoose_1.Schema({
    band: { type: Number, required: true },
    taskAchievement: { type: String },
    coherenceCohesion: { type: String },
    lexicalResource: { type: String },
    grammaticalRange: { type: String }
});
// Writing Task Schema
const WritingTaskSchema = new mongoose_1.Schema({
    taskNumber: { type: Number, required: true, enum: [1, 2] },
    taskType: {
        type: String,
        required: true,
        enum: ["task1-academic", "task1-gt", "task2"]
    },
    subType: {
        type: String,
        required: true,
        enum: [
            // Task 1 Academic
            "line-graph", "bar-chart", "pie-chart", "table",
            "process-diagram", "map-comparison", "multiple-charts", "flow-chart",
            // Task 1 GT
            "formal-letter", "semi-formal-letter", "informal-letter",
            // Task 2
            "opinion", "discussion", "discussion-opinion",
            "problem-solution", "problem-causes-solutions",
            "advantages-disadvantages", "advantages-disadvantages-opinion",
            "two-part-question", "direct-question"
        ]
    },
    prompt: { type: String, required: true },
    instructions: { type: String, required: true },
    minWords: { type: Number, required: true },
    recommendedTime: { type: Number, required: true },
    images: [ImageSchema],
    letterContext: LetterContextSchema,
    keyPoints: [{ type: String }],
    sampleAnswer: { type: String },
    bandDescriptors: [BandDescriptorSchema],
    examinerTips: [{ type: String }]
});
// Main Writing Test Schema
const WritingTestSchema = new mongoose_1.Schema({
    testId: { type: String, required: true, unique: true },
    testNumber: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    testType: {
        type: String,
        enum: ["academic", "general-training"],
        default: "academic"
    },
    source: { type: String },
    tasks: [WritingTaskSchema],
    totalTasks: { type: Number, default: 2 },
    duration: { type: Number, default: 60 },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    topicCategories: [{ type: String }],
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});
// Writing Submission Schema (for storing student responses)
const WritingSubmissionSchema = new mongoose_1.Schema({
    taskNumber: { type: Number, required: true, enum: [1, 2] },
    response: { type: String, required: true },
    wordCount: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    scores: {
        taskAchievement: { type: Number },
        coherenceCohesion: { type: Number },
        lexicalResource: { type: Number },
        grammaticalAccuracy: { type: Number }
    },
    bandScore: { type: Number },
    feedback: {
        overall: { type: String },
        taskAchievement: { type: String },
        coherenceCohesion: { type: String },
        lexicalResource: { type: String },
        grammaticalRange: { type: String }
    },
    markingStatus: {
        type: String,
        enum: ["pending", "in-review", "marked"],
        default: "pending"
    },
    markedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    markedAt: { type: Date }
}, {
    timestamps: true
});
// Indexes
WritingTestSchema.index({ testNumber: 1 });
WritingTestSchema.index({ testType: 1, isActive: 1 });
WritingTestSchema.index({ topicCategories: 1 });
// Auto-generate testId
const generateWritingTestId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastTest = yield exports.WritingTest.findOne()
        .sort({ testNumber: -1 })
        .select("testNumber")
        .lean();
    const testNumber = ((lastTest === null || lastTest === void 0 ? void 0 : lastTest.testNumber) || 0) + 1;
    const testId = `WRITING_${testNumber.toString().padStart(3, "0")}`;
    return { testId, testNumber };
});
exports.generateWritingTestId = generateWritingTestId;
exports.WritingTest = mongoose_1.default.model("WritingTest", WritingTestSchema);
exports.WritingSubmission = mongoose_1.default.model("WritingSubmission", WritingSubmissionSchema);
