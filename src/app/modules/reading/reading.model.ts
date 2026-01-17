import mongoose, { Schema, Document } from "mongoose";
import { IReadingTest, IReadingSection, IReadingQuestion } from "./reading.interface";

// Question Schema
const ReadingQuestionSchema = new Schema<IReadingQuestion>({
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
            "matching",  // Generic matching
            "sentence-completion",
            "summary-completion",
            "summary-completion-wordlist",
            "note-completion",
            "table-completion",
            "flow-chart-completion",
            "diagram-labeling",
            "fill-in-blank",  // Generic fill in blank
            "short-answer"
        ]
    },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    headingsList: [{ type: String }],
    wordList: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    acceptableAnswers: [{ type: String }],
    wordLimit: { type: Number },
    paragraphRef: { type: String },
    imageUrl: { type: String },
    marks: { type: Number, default: 1 },
    explanation: { type: String }
});

// Question Group Schema
const QuestionGroupSchema = new Schema({
    startQuestion: { type: Number, required: true },
    endQuestion: { type: Number, required: true },
    questionType: { type: String, required: true },
    instructions: { type: String, required: true },
    headings: [{ type: String }],
    wordList: [{ type: String }]
});

// Paragraph Schema
const ParagraphSchema = new Schema({
    label: { type: String, required: true },
    text: { type: String, required: true }
});

// Section Schema
const ReadingSectionSchema = new Schema<IReadingSection>({
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
const ReadingTestSchema = new Schema<IReadingTest & Document>(
    {
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
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true
    }
);

// Indexes
ReadingTestSchema.index({ testNumber: 1 });
ReadingTestSchema.index({ testType: 1, isActive: 1 });

// Auto-generate testId
export const generateReadingTestId = async (): Promise<{ testId: string; testNumber: number }> => {
    const lastTest = await ReadingTest.findOne()
        .sort({ testNumber: -1 })
        .select("testNumber")
        .lean();

    const testNumber = (lastTest?.testNumber || 0) + 1;
    const testId = `READING_${testNumber.toString().padStart(3, "0")}`;

    return { testId, testNumber };
};

export const ReadingTest = mongoose.model<IReadingTest & Document>("ReadingTest", ReadingTestSchema);
