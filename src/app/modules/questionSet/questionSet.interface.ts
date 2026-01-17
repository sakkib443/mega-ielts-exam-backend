import { Types } from "mongoose";

// Question types for IELTS
export type QuestionType =
    | "multiple-choice"
    | "matching"
    | "form-completion"
    | "note-completion"
    | "sentence-completion"
    | "summary-completion"
    | "true-false-not-given"
    | "yes-no-not-given"
    | "short-answer"
    | "diagram-labeling"
    | "fill-in-blank";

// Writing Task 1 subtypes (Visual data)
export type WritingTask1SubType =
    | "line-graph"
    | "bar-chart"
    | "pie-chart"
    | "table"
    | "map-comparison"
    | "process-diagram"
    | "mixed-charts"
    | "diagram";

// Writing Task 2 subtypes (Essay types)
export type WritingTask2SubType =
    | "opinion"
    | "discussion"
    | "problem-solution"
    | "advantages-disadvantages"
    | "two-part-question"
    | "direct-question";

// Set type
export type SetType = "LISTENING" | "READING" | "WRITING";

// Individual question
export interface ISetQuestion {
    questionNumber: number;
    questionType: QuestionType;
    questionText: string;
    options?: string[];
    correctAnswer: string | string[];
    audioTimestamp?: string;
    imageUrl?: string;
    marks: number;
}

// Section within a set
export interface ISetSection {
    sectionNumber: number;
    title: string;
    instructions: string;
    audioUrl?: string;
    passage?: string;
    imageUrl?: string;
    questions: ISetQuestion[];
}

// Writing task
export interface IWritingSetTask {
    taskNumber: number;
    taskType: "task1" | "task2";

    // Task 1 specific (Visual data description)
    task1SubType?: WritingTask1SubType;

    // Task 2 specific (Essay type)
    task2SubType?: WritingTask2SubType;

    // Main prompt/question
    prompt: string;

    // Additional instructions
    instructions?: string;

    // Images (can have multiple for map comparisons)
    imageUrl?: string;
    imageUrls?: string[]; // For multiple images (before/after maps)
    imageDescriptions?: string[]; // Descriptions for each image

    // Word requirements
    minWords: number;
    recommendedTime?: number; // in minutes (20 for Task 1, 40 for Task 2)

    // Scoring criteria
    scoringCriteria?: {
        taskAchievement: number; // 25%
        coherenceCohesion: number; // 25%
        lexicalResource: number; // 25%
        grammaticalAccuracy: number; // 25%
    };

    // Sample/Model answer
    sampleAnswer?: string;

    // Key points to cover (for evaluation)
    keyPoints?: string[];

    // Band descriptors for this task
    bandDescriptors?: {
        band: number;
        description: string;
    }[];
}

// Main Question Set interface
export interface IQuestionSet {
    // Set identification
    setId: string; // LISTENING_SET_001, READING_SET_005, etc.
    setType: SetType;
    setNumber: number;
    title: string;
    description?: string;

    // For Listening/Reading sets
    sections?: ISetSection[];

    // For Writing sets
    writingTasks?: IWritingSetTask[];

    // Audio for listening
    mainAudioUrl?: string;
    audioDuration?: number; // in seconds

    // Metadata
    totalQuestions: number;
    totalMarks: number;
    duration: number; // in minutes
    difficulty: "easy" | "medium" | "hard";

    // Status
    isActive: boolean;
    usageCount: number;

    // Timestamps
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Create question set input
export interface ICreateQuestionSetInput {
    setType: SetType;
    title: string;
    description?: string;
    sections?: ISetSection[];
    writingTasks?: IWritingSetTask[];
    mainAudioUrl?: string;
    audioDuration?: number;
    duration: number;
    difficulty?: "easy" | "medium" | "hard";
}

// Filters for listing
export interface IQuestionSetFilters {
    setType?: SetType;
    difficulty?: string;
    isActive?: boolean;
    searchTerm?: string;
}
