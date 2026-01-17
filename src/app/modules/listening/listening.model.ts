import mongoose, { Schema, Document } from "mongoose";
import { IListeningTest, IListeningSection, IListeningQuestion } from "./listening.interface";

// Question Schema
const ListeningQuestionSchema = new Schema<IListeningQuestion>({
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
    correctAnswer: { type: Schema.Types.Mixed, required: true }, // String or String[]
    acceptableAnswers: [{ type: String }],
    audioTimestamp: { type: String },
    imageUrl: { type: String },
    wordLimit: { type: Number },
    marks: { type: Number, default: 1 },
    explanation: { type: String }
});

// Section Schema
const ListeningSectionSchema = new Schema<IListeningSection>({
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
const ListeningTestSchema = new Schema<IListeningTest & Document>(
    {
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
        duration: { type: Number, default: 40 }, // 30 min + 10 min transfer
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
ListeningTestSchema.index({ testNumber: 1 });
ListeningTestSchema.index({ isActive: 1, difficulty: 1 });

// Auto-generate testId
export const generateListeningTestId = async (): Promise<{ testId: string; testNumber: number }> => {
    const lastTest = await ListeningTest.findOne()
        .sort({ testNumber: -1 })
        .select("testNumber")
        .lean();

    const testNumber = (lastTest?.testNumber || 0) + 1;
    const testId = `LISTENING_${testNumber.toString().padStart(3, "0")}`;

    return { testId, testNumber };
};

export const ListeningTest = mongoose.model<IListeningTest & Document>("ListeningTest", ListeningTestSchema);
