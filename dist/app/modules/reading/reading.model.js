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
exports.ReadingTest = exports.generateReadingTestId = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Question Schema
const ReadingQuestionSchema = new mongoose_1.Schema({
    questionNumber: { type: Number, required: true },
    questionType: {
        type: String,
        required: true,
        enum: [
            "multiple-choice",
            "multiple-choice-multi",
            "true-false-not-given",
            "yes-no-not-given",
            "matching-information",
            "matching-headings",
            "matching-features",
            "matching-sentence-endings",
            "matching",
            "sentence-completion",
            "summary-completion",
            "summary-completion-wordlist",
            "note-completion",
            "table-completion",
            "flow-chart-completion",
            "diagram-labeling",
            "fill-in-blank",
            "short-answer"
        ]
    },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    headingsList: [{ type: String }],
    wordList: [{ type: String }],
    correctAnswer: { type: mongoose_1.Schema.Types.Mixed, required: true },
    acceptableAnswers: [{ type: String }],
    wordLimit: { type: Number },
    paragraphRef: { type: String },
    imageUrl: { type: String },
    marks: { type: Number, default: 1 },
    explanation: { type: String }
});
// Question Group Schema
const QuestionGroupSchema = new mongoose_1.Schema({
    startQuestion: { type: Number, required: true },
    endQuestion: { type: Number, required: true },
    questionType: { type: String, required: true },
    instructions: { type: String, required: true },
    headings: [{ type: String }],
    wordList: [{ type: String }]
});
// Paragraph Schema
const ParagraphSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    text: { type: String, required: true }
});
// Section Schema
const ReadingSectionSchema = new mongoose_1.Schema({
    sectionNumber: { type: Number, required: true, min: 1, max: 3 },
    title: { type: String, required: true },
    passage: { type: String, required: true },
    passageSource: { type: String },
    paragraphs: [ParagraphSchema],
    instructions: { type: String, required: true },
    imageUrl: { type: String },
    questions: [ReadingQuestionSchema],
    questionGroups: [QuestionGroupSchema]
});
// Main Reading Test Schema
const ReadingTestSchema = new mongoose_1.Schema({
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
    sections: [ReadingSectionSchema],
    totalQuestions: { type: Number, default: 40 },
    totalMarks: { type: Number, default: 40 },
    duration: { type: Number, default: 60 },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});
// Indexes
ReadingTestSchema.index({ testNumber: 1 });
ReadingTestSchema.index({ testType: 1, isActive: 1 });
// Auto-generate testId
const generateReadingTestId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastTest = yield exports.ReadingTest.findOne()
        .sort({ testNumber: -1 })
        .select("testNumber")
        .lean();
    const testNumber = ((lastTest === null || lastTest === void 0 ? void 0 : lastTest.testNumber) || 0) + 1;
    const testId = `READING_${testNumber.toString().padStart(3, "0")}`;
    return { testId, testNumber };
});
exports.generateReadingTestId = generateReadingTestId;
exports.ReadingTest = mongoose_1.default.model("ReadingTest", ReadingTestSchema);
