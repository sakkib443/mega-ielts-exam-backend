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
    instruction: { type: String },
    explanation: { type: String }
});

// Question Group Schema - Flexible for different question formats
const BulletSchema = new Schema({
    type: { type: String, enum: ["context", "question"], required: true },
    text: { type: String }, // For context bullets
    questionNumber: { type: Number }, // For question bullets
    textBefore: { type: String }, // Text before the blank
    textAfter: { type: String }, // Text after the blank
    correctAnswer: { type: String }
}, { _id: false });

const NotesSectionSchema = new Schema({
    subHeading: { type: String, required: true },
    bullets: [BulletSchema]
}, { _id: false });

const StatementSchema = new Schema({
    questionNumber: { type: Number, required: true },
    text: { type: String, required: true },
    correctAnswer: { type: String, required: true }
}, { _id: false });

const OptionsExplanationSchema = new Schema({
    label: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: false });

const MatchingItemSchema = new Schema({
    questionNumber: { type: Number, required: true },
    text: { type: String, required: true },
    correctAnswer: { type: String, required: true }
}, { _id: false });

const SummarySegmentSchema = new Schema({
    type: { type: String, enum: ["text", "blank"], required: true },
    content: { type: String }, // For text segments
    questionNumber: { type: Number }, // For blank segments
    correctAnswer: { type: String }
}, { _id: false });

const QuestionGroupSchema = new Schema({
    groupType: { type: String, required: true }, // "note-completion", "true-false-not-given", "matching-information", "summary-completion", etc.
    startQuestion: { type: Number, required: true },
    endQuestion: { type: Number, required: true },
    mainInstruction: { type: String },
    subInstruction: { type: String },
    mainHeading: { type: String },
    note: { type: String }, // For "NB You may use any letter more than once."
    // For note-completion
    notesSections: [NotesSectionSchema],
    // For TRUE/FALSE/NOT GIVEN and YES/NO/NOT GIVEN
    optionsExplanation: [OptionsExplanationSchema],
    statements: [StatementSchema],
    // For matching-information
    paragraphOptions: [{ type: String }], // ["A", "B", "C", "D", "E", "F", "G"]
    matchingItems: [MatchingItemSchema],
    // For summary-completion
    summarySegments: [SummarySegmentSchema],
    // For choose-two-letters
    questionSets: [{
        questionNumbers: [{ type: Number }],
        questionText: { type: String },
        options: [{
            letter: { type: String },
            text: { type: String }
        }],
        correctAnswers: [{ type: String }]
    }],
    // For summary-with-options (phrase list)
    phraseList: [{
        letter: { type: String },
        text: { type: String }
    }],
    // For multiple-choice-full
    mcQuestions: [{
        questionNumber: { type: Number },
        questionText: { type: String },
        options: [{
            letter: { type: String },
            text: { type: String }
        }],
        correctAnswer: { type: String }
    }],
    // Legacy fields
    questionType: { type: String },
    instructions: { type: String },
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
