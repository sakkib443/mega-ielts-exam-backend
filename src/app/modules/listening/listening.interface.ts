import { Types } from "mongoose";

/**
 * IELTS Listening Question Types
 * 
 * 1. Multiple Choice - Choose correct answer from options
 * 2. Matching - Match items from two lists
 * 3. Plan/Map/Diagram Labeling - Label locations on a visual
 * 4. Form Completion - Fill in gaps in a form
 * 5. Note Completion - Complete notes
 * 6. Table Completion - Fill in table cells
 * 7. Flow Chart Completion - Complete a flow chart
 * 8. Summary Completion - Fill gaps in a summary
 * 9. Sentence Completion - Complete sentences
 * 10. Short Answer - Write short answers
 */

export type ListeningQuestionType =
    | "multiple-choice"
    | "multiple-choice-multi"  // Multiple answers allowed
    | "matching"
    | "map-labeling"
    | "diagram-labeling"
    | "form-completion"
    | "note-completion"
    | "table-completion"
    | "flow-chart-completion"
    | "summary-completion"
    | "sentence-completion"
    | "short-answer";

// Individual listening question
export interface IListeningQuestion {
    questionNumber: number;
    questionType: ListeningQuestionType;
    questionText: string;

    // For multiple choice questions
    options?: string[];

    // Correct answer(s) - can be string or array for multi-select
    correctAnswer: string | string[];

    // Alternative acceptable answers
    acceptableAnswers?: string[];

    // Audio timestamp for this question (e.g., "02:35")
    audioTimestamp?: string;

    // Image URL for diagram/map labeling
    imageUrl?: string;

    // Word limit for completion questions
    wordLimit?: number;

    // Marks for this question
    marks: number;

    // Explanation for correct answer
    explanation?: string;
}

// Section within listening test (Part 1, 2, 3, 4)
export interface IListeningSection {
    sectionNumber: number; // 1, 2, 3, or 4
    title: string;

    // Section context/description
    context: string; // e.g., "A conversation between two friends about..."

    // Audio URL for this section (if separate from main audio)
    audioUrl?: string;

    // Instructions for this section
    instructions: string;

    // Passage/script shown to students (if any)
    passage?: string;

    // Image for the entire section (e.g., a map)
    imageUrl?: string;

    // Questions in this section
    questions: IListeningQuestion[];
}

// Main Listening Test interface
export interface IListeningTest {
    // Identification
    testId: string; // LISTENING_001, LISTENING_002, etc.
    testNumber: number;
    title: string;
    description?: string;

    // Source (e.g., "Cambridge IELTS Book 15 Test 1")
    source?: string;

    // Main audio for entire test
    mainAudioUrl?: string;
    audioDuration?: number; // in seconds

    // 4 Sections (Parts)
    sections: IListeningSection[];

    // Metadata
    totalQuestions: number; // Should be 40
    totalMarks: number;
    duration: number; // in minutes (30 + 10 transfer time = 40)
    difficulty: "easy" | "medium" | "hard";

    // Status
    isActive: boolean;
    usageCount: number;

    // Timestamps
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Input for creating listening test
export interface ICreateListeningTestInput {
    title: string;
    description?: string;
    source?: string;
    mainAudioUrl?: string;
    audioDuration?: number;
    sections: IListeningSection[];
    difficulty?: "easy" | "medium" | "hard";
}

// Filters for listing
export interface IListeningTestFilters {
    difficulty?: string;
    isActive?: boolean;
    searchTerm?: string;
}

// Band score conversion (IELTS Listening)
export const LISTENING_BAND_CONVERSION: Record<number, number> = {
    40: 9.0, 39: 9.0,
    38: 8.5, 37: 8.5,
    36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5, 32: 7.5,
    31: 7.0, 30: 7.0,
    29: 6.5, 28: 6.5, 27: 6.5,
    26: 6.0, 25: 6.0, 24: 6.0, 23: 6.0,
    22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5,
    17: 5.0, 16: 5.0,
    15: 4.5, 14: 4.5, 13: 4.5,
    12: 4.0, 11: 4.0, 10: 4.0,
    9: 3.5, 8: 3.5,
    7: 3.0, 6: 3.0, 5: 3.0,
    4: 2.5,
    3: 2.0,
    2: 1.5,
    1: 1.0,
    0: 0
};

// Helper function to get band score
export const getListeningBandScore = (correctAnswers: number): number => {
    if (correctAnswers > 40) correctAnswers = 40;
    if (correctAnswers < 0) correctAnswers = 0;
    return LISTENING_BAND_CONVERSION[correctAnswers] || 0;
};
