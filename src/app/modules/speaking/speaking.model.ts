import mongoose, { Schema, Document } from "mongoose";
import {
    ISpeakingTest,
    ISpeakingPart1,
    ISpeakingPart1Topic,
    ISpeakingPart2,
    ISpeakingPart3,
} from "./speaking.interface";

// Part 1 Topic Schema
const SpeakingPart1TopicSchema = new Schema<ISpeakingPart1Topic>({
    topicName: { type: String, required: true },
    questions: [{ type: String, required: true }],
});

// Part 1 Schema
const SpeakingPart1Schema = new Schema<ISpeakingPart1>({
    topics: [SpeakingPart1TopicSchema],
    duration: { type: Number, default: 5 }, // 4-5 minutes
});

// Part 2 Schema (Cue Card)
const SpeakingPart2Schema = new Schema<ISpeakingPart2>({
    topic: { type: String, required: true },
    cueCard: { type: String, required: true },
    bulletPoints: [{ type: String, required: true }],
    followUpQuestion: { type: String },
    preparationTime: { type: Number, default: 60 }, // 60 seconds
    speakingTime: { type: Number, default: 120 }, // 120 seconds
    followUpQuestions: [{ type: String }],
});

// Part 3 Schema
const SpeakingPart3Schema = new Schema<ISpeakingPart3>({
    topic: { type: String, required: true },
    questions: [{ type: String, required: true }],
    duration: { type: Number, default: 5 }, // 4-5 minutes
});

// Main Speaking Test Schema
const SpeakingTestSchema = new Schema<ISpeakingTest & Document>(
    {
        testId: { type: String, required: true, unique: true },
        testNumber: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String },
        source: { type: String },

        part1: SpeakingPart1Schema,
        part2: SpeakingPart2Schema,
        part3: SpeakingPart3Schema,

        totalQuestions: { type: Number, default: 0 },
        duration: { type: Number, default: 14 }, // 11-14 minutes
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
        },
        isActive: { type: Boolean, default: true },
        usageCount: { type: Number, default: 0 },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);

// Indexes
SpeakingTestSchema.index({ testNumber: 1 });
SpeakingTestSchema.index({ isActive: 1, difficulty: 1 });

// Auto-generate testId
export const generateSpeakingTestId = async (): Promise<{ testId: string; testNumber: number }> => {
    const lastTest = await SpeakingTest.findOne()
        .sort({ testNumber: -1 })
        .select("testNumber")
        .lean();

    const testNumber = (lastTest?.testNumber || 0) + 1;
    const testId = `SPEAKING_${testNumber.toString().padStart(3, "0")}`;

    return { testId, testNumber };
};

export const SpeakingTest = mongoose.model<ISpeakingTest & Document>("SpeakingTest", SpeakingTestSchema);
