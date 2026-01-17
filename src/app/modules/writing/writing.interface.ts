import { Types } from "mongoose";

/**
 * IELTS Writing Task Types
 * 
 * TASK 1 (Academic):
 * - Line Graph, Bar Chart, Pie Chart, Table
 * - Process Diagram, Map Comparison, Multiple Charts
 * 
 * TASK 1 (General Training):
 * - Letter Writing (Formal, Semi-formal, Informal)
 * 
 * TASK 2 (Both):
 * - Opinion Essay, Discussion Essay
 * - Problem-Solution, Advantages-Disadvantages
 * - Two-Part Question, Direct Question
 */

// Task 1 Academic subtypes
export type WritingTask1AcademicType =
    | "line-graph"
    | "bar-chart"
    | "pie-chart"
    | "table"
    | "process-diagram"
    | "map-comparison"
    | "multiple-charts"
    | "flow-chart";

// Task 1 General Training subtypes
export type WritingTask1GTType =
    | "formal-letter"
    | "semi-formal-letter"
    | "informal-letter";

// Task 2 Essay types
export type WritingTask2Type =
    | "opinion"
    | "discussion"
    | "discussion-opinion"  // Discuss both views and give opinion
    | "problem-solution"
    | "problem-causes-solutions"
    | "advantages-disadvantages"
    | "advantages-disadvantages-opinion"
    | "two-part-question"
    | "direct-question";

// Writing scoring criteria
export interface IWritingScoreCriteria {
    taskAchievement: number;      // Task Response/Achievement (25%)
    coherenceCohesion: number;    // Coherence and Cohesion (25%)
    lexicalResource: number;      // Lexical Resource (25%)
    grammaticalAccuracy: number;  // Grammatical Range and Accuracy (25%)
}

// Band descriptors
export interface IBandDescriptor {
    band: number;
    taskAchievement: string;
    coherenceCohesion: string;
    lexicalResource: string;
    grammaticalRange: string;
}

// Writing Task interface
export interface IWritingTask {
    taskNumber: 1 | 2;

    // Task type categorization
    taskType: "task1-academic" | "task1-gt" | "task2";
    subType: WritingTask1AcademicType | WritingTask1GTType | WritingTask2Type;

    // The question/prompt
    prompt: string;

    // Additional instructions
    instructions: string;

    // Word requirements
    minWords: number;  // 150 for Task 1, 250 for Task 2
    recommendedTime: number;  // in minutes (20 for Task 1, 40 for Task 2)

    // Visual materials (for Task 1 Academic)
    images?: Array<{
        url: string;
        description: string;  // Alt text / accessibility
        caption?: string;     // What the image shows
    }>;

    // For letter writing (Task 1 GT)
    letterContext?: {
        recipientType: "friend" | "employer" | "official" | "colleague";
        situation: string;
        bulletPoints: string[];  // Points to include
    };

    // Key points to cover (for evaluation)
    keyPoints?: string[];

    // Sample/Model answer
    sampleAnswer?: string;

    // Band descriptors specific to this task
    bandDescriptors?: IBandDescriptor[];

    // Examiner tips
    examinerTips?: string[];
}

// Main Writing Test interface
export interface IWritingTest {
    testId: string;
    testNumber: number;
    title: string;
    description?: string;

    // Test type
    testType: "academic" | "general-training";

    // Source
    source?: string;

    // Two writing tasks
    tasks: IWritingTask[];

    // Metadata
    totalTasks: number;  // Always 2
    duration: number;    // 60 minutes
    difficulty: "easy" | "medium" | "hard";

    // Topic categories for search/filter
    topicCategories?: string[];  // e.g., ["Education", "Technology", "Environment"]

    // Status
    isActive: boolean;
    usageCount: number;

    // Timestamps
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Student's writing submission
export interface IWritingSubmission {
    taskNumber: 1 | 2;
    response: string;
    wordCount: number;
    submittedAt: Date;

    // Scores (set by examiner)
    scores?: IWritingScoreCriteria;
    bandScore?: number;

    // Examiner feedback
    feedback?: {
        overall: string;
        taskAchievement?: string;
        coherenceCohesion?: string;
        lexicalResource?: string;
        grammaticalRange?: string;
    };

    // Marking status
    markingStatus: "pending" | "in-review" | "marked";
    markedBy?: Types.ObjectId;
    markedAt?: Date;
}

// Input for creating writing test
export interface ICreateWritingTestInput {
    title: string;
    description?: string;
    testType?: "academic" | "general-training";
    source?: string;
    tasks: IWritingTask[];
    topicCategories?: string[];
    difficulty?: "easy" | "medium" | "hard";
}

// Filters
export interface IWritingTestFilters {
    testType?: string;
    difficulty?: string;
    topicCategory?: string;
    isActive?: boolean;
    searchTerm?: string;
}

// Common topic categories for IELTS Writing
export const WRITING_TOPIC_CATEGORIES = [
    "Education",
    "Technology",
    "Environment",
    "Health",
    "Society",
    "Culture",
    "Economy",
    "Government",
    "Media",
    "Crime",
    "Sports",
    "Travel",
    "Work",
    "Family",
    "Science",
    "Art",
    "Food",
    "Housing",
    "Transport",
    "Communication"
];

// Calculate overall writing band from criteria scores
export const calculateWritingBand = (scores: IWritingScoreCriteria): number => {
    const { taskAchievement, coherenceCohesion, lexicalResource, grammaticalAccuracy } = scores;
    const average = (taskAchievement + coherenceCohesion + lexicalResource + grammaticalAccuracy) / 4;
    // Round to nearest 0.5
    return Math.round(average * 2) / 2;
};

// Default band descriptors
export const DEFAULT_BAND_DESCRIPTORS: IBandDescriptor[] = [
    {
        band: 9,
        taskAchievement: "Fully addresses all parts of the task; presents a fully developed position",
        coherenceCohesion: "Uses cohesion in such a way that it attracts no attention; skillfully manages paragraphing",
        lexicalResource: "Uses a wide range of vocabulary with very natural and sophisticated control",
        grammaticalRange: "Uses a wide range of structures with full flexibility and accuracy"
    },
    {
        band: 8,
        taskAchievement: "Sufficiently addresses all parts of the task; presents a well-developed response",
        coherenceCohesion: "Sequences information and ideas logically; manages all aspects of cohesion well",
        lexicalResource: "Uses a wide range of vocabulary fluently and flexibly; rare minor errors",
        grammaticalRange: "Uses a wide range of structures; majority of sentences are error-free"
    },
    {
        band: 7,
        taskAchievement: "Addresses all parts of the task; presents a clear position throughout the response",
        coherenceCohesion: "Logically organizes information and ideas; clear progression throughout",
        lexicalResource: "Uses sufficient range of vocabulary; uses less common lexical items with some awareness",
        grammaticalRange: "Uses a variety of complex structures; produces frequent error-free sentences"
    },
    {
        band: 6,
        taskAchievement: "Addresses all parts of the task although some parts may be more fully covered than others",
        coherenceCohesion: "Arranges information and ideas coherently; uses cohesive devices effectively",
        lexicalResource: "Uses an adequate range of vocabulary; attempts less common vocabulary with some inaccuracy",
        grammaticalRange: "Uses a mix of simple and complex sentence forms; makes some errors in grammar"
    },
    {
        band: 5,
        taskAchievement: "Addresses the task only partially; format may be inappropriate in places",
        coherenceCohesion: "Presents information with some organization but there may be lack of overall progression",
        lexicalResource: "Uses a limited range of vocabulary; may make noticeable errors in spelling/word formation",
        grammaticalRange: "Uses only a limited range of structures; attempts complex sentences but with limited accuracy"
    }
];
