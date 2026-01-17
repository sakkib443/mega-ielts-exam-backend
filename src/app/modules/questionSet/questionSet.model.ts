import { Schema, model } from "mongoose";
import {
    IQuestionSet,
    ISetSection,
    ISetQuestion,
    IWritingSetTask,
} from "./questionSet.interface";

// Question sub-schema
const questionSchema = new Schema<ISetQuestion>(
    {
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
        correctAnswer: { type: Schema.Types.Mixed, required: true },
        audioTimestamp: { type: String },
        imageUrl: { type: String },
        marks: { type: Number, default: 1 },
    },
    { _id: false }
);

// Section sub-schema
const sectionSchema = new Schema<ISetSection>(
    {
        sectionNumber: { type: Number, required: true },
        title: { type: String, required: true },
        instructions: { type: String, required: true },
        audioUrl: { type: String },
        passage: { type: String },
        imageUrl: { type: String },
        questions: [questionSchema],
    },
    { _id: false }
);

// Writing task sub-schema
const writingTaskSchema = new Schema<IWritingSetTask>(
    {
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
        recommendedTime: { type: Number }, // in minutes

        // Scoring criteria (percentages)
        scoringCriteria: {
            type: new Schema({
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
    },
    { _id: false }
);

// Main QuestionSet schema
const questionSetSchema = new Schema<IQuestionSet>(
    {
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
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
questionSetSchema.index({ setType: 1, setNumber: 1 });
questionSetSchema.index({ setId: 1 });
questionSetSchema.index({ isActive: 1 });

// Create model with static methods
export const QuestionSet = model<IQuestionSet>("QuestionSet", questionSetSchema);

// Helper function to generate set ID (instead of static method)
export const generateSetId = async (
    setType: "LISTENING" | "READING" | "WRITING"
): Promise<{ setId: string; setNumber: number }> => {
    const lastSet = await QuestionSet.findOne({ setType })
        .sort({ setNumber: -1 })
        .limit(1);

    const nextNumber = lastSet ? lastSet.setNumber + 1 : 1;
    const paddedNumber = nextNumber.toString().padStart(3, "0");
    const setId = `${setType}_SET_${paddedNumber}`;

    return { setId, setNumber: nextNumber };
};
