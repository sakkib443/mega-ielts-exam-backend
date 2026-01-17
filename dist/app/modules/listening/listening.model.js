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
exports.ListeningTest = exports.generateListeningTestId = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Question Schema
const ListeningQuestionSchema = new mongoose_1.Schema({
    questionNumber: { type: Number, required: true },
    questionType: {
        type: String,
        required: true,
        enum: [
            "multiple-choice",
            "multiple-choice-multi",
            "matching",
            "map-labeling",
            "diagram-labeling",
            "form-completion",
            "note-completion",
            "table-completion",
            "flow-chart-completion",
            "summary-completion",
            "sentence-completion",
            "short-answer"
        ]
    },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: mongoose_1.Schema.Types.Mixed, required: true },
    acceptableAnswers: [{ type: String }],
    audioTimestamp: { type: String },
    imageUrl: { type: String },
    wordLimit: { type: Number },
    marks: { type: Number, default: 1 },
    explanation: { type: String }
});
// Section Schema
const ListeningSectionSchema = new mongoose_1.Schema({
    sectionNumber: { type: Number, required: true, min: 1, max: 4 },
    title: { type: String, required: true },
    context: { type: String, required: true },
    audioUrl: { type: String },
    instructions: { type: String, required: true },
    passage: { type: String },
    imageUrl: { type: String },
    questions: [ListeningQuestionSchema]
});
// Main Listening Test Schema
const ListeningTestSchema = new mongoose_1.Schema({
    testId: { type: String, required: true, unique: true },
    testNumber: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    source: { type: String },
    mainAudioUrl: { type: String },
    audioDuration: { type: Number },
    sections: [ListeningSectionSchema],
    totalQuestions: { type: Number, default: 40 },
    totalMarks: { type: Number, default: 40 },
    duration: { type: Number, default: 40 },
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
ListeningTestSchema.index({ testNumber: 1 });
ListeningTestSchema.index({ isActive: 1, difficulty: 1 });
// Auto-generate testId
const generateListeningTestId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastTest = yield exports.ListeningTest.findOne()
        .sort({ testNumber: -1 })
        .select("testNumber")
        .lean();
    const testNumber = ((lastTest === null || lastTest === void 0 ? void 0 : lastTest.testNumber) || 0) + 1;
    const testId = `LISTENING_${testNumber.toString().padStart(3, "0")}`;
    return { testId, testNumber };
});
exports.generateListeningTestId = generateListeningTestId;
exports.ListeningTest = mongoose_1.default.model("ListeningTest", ListeningTestSchema);
