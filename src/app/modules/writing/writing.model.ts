import mongoose, { Schema, Document } from "mongoose";
import { IWritingTest, IWritingTask, IWritingSubmission } from "./writing.interface";

// Image Schema
const ImageSchema = new Schema({
    url: { type: String, required: true },
    description: { type: String, default: "" },
    caption: { type: String }
});

// Letter Context Schema (for GT Task 1)
const LetterContextSchema = new Schema({
    recipientType: {
        type: String,
        enum: ["friend", "employer", "official", "colleague"]
    },
    situation: { type: String },
    bulletPoints: [{ type: String }]
});

// Band Descriptor Schema
const BandDescriptorSchema = new Schema({
    band: { type: Number, required: true },
    taskAchievement: { type: String },
    coherenceCohesion: { type: String },
    lexicalResource: { type: String },
    grammaticalRange: { type: String }
});

// Writing Task Schema
const WritingTaskSchema = new Schema<IWritingTask>({
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
const WritingTestSchema = new Schema<IWritingTest & Document>(
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
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true
    }
);

// Writing Submission Schema (for storing student responses)
const WritingSubmissionSchema = new Schema<IWritingSubmission & Document>(
    {
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
        markedBy: { type: Schema.Types.ObjectId, ref: "User" },
        markedAt: { type: Date }
    },
    {
        timestamps: true
    }
);

// Indexes
WritingTestSchema.index({ testNumber: 1 });
WritingTestSchema.index({ testType: 1, isActive: 1 });
WritingTestSchema.index({ topicCategories: 1 });

// Auto-generate testId
export const generateWritingTestId = async (): Promise<{ testId: string; testNumber: number }> => {
    const lastTest = await WritingTest.findOne()
        .sort({ testNumber: -1 })
        .select("testNumber")
        .lean();

    const testNumber = (lastTest?.testNumber || 0) + 1;
    const testId = `WRITING_${testNumber.toString().padStart(3, "0")}`;

    return { testId, testNumber };
};

export const WritingTest = mongoose.model<IWritingTest & Document>("WritingTest", WritingTestSchema);
export const WritingSubmission = mongoose.model<IWritingSubmission & Document>("WritingSubmission", WritingSubmissionSchema);
