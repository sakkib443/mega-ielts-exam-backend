import { Types } from "mongoose";

/**
 * IELTS Reading Question Types
 * 
 * 1. Multiple Choice - Choose correct answer(s)
 * 2. Identifying Information - True/False/Not Given
 * 3. Identifying Writer's Views - Yes/No/Not Given
 * 4. Matching Information - Match paragraphs to statements
 * 5. Matching Headings - Match headings to paragraphs
 * 6. Matching Features - Match features to categories
 * 7. Matching Sentence Endings - Complete sentence endings
 * 8. Sentence Completion - Complete sentences with words from text
 * 9. Summary Completion - Fill gaps in summary
 * 10. Note Completion - Complete notes
 * 11. Table Completion - Fill table cells
 * 12. Flow Chart Completion - Complete flow chart
 * 13. Diagram Label Completion - Label diagram parts
 * 14. Short Answer Questions - Brief answers from text
 */

export type ReadingQuestionType =
    | "multiple-choice"
    | "multiple-choice-multi"
    | "true-false-not-given"
    | "yes-no-not-given"
    | "matching-information"
    | "matching-headings"
    | "matching-features"
    | "matching-sentence-endings"
    | "sentence-completion"
    | "summary-completion"
    | "summary-completion-wordlist"  // Summary with word list
    | "note-completion"
    | "table-completion"
    | "flow-chart-completion"
    | "diagram-labeling"
    | "short-answer";

// Individual reading question
export interface IReadingQuestion {
    questionNumber: number;
    questionType: ReadingQuestionType;
    questionText: string;

    // For MCQ and matching
    options?: string[];

    // For matching headings - list of headings
    headingsList?: string[];

    // Word list for summary completion with word bank
    wordList?: string[];

    // Correct answer(s)
    correctAnswer: string | string[];

    // Alternative acceptable answers
    acceptableAnswers?: string[];

    // Word limit for completion
    wordLimit?: number;

    // Paragraph reference (e.g., "A", "B", "C")
    paragraphRef?: string;

    // Image URL for diagram questions
    imageUrl?: string;

    // Marks
    marks: number;

    // Specific instruction for this question
    instruction?: string;

    // Explanation
    explanation?: string;
}

// Reading passage section
export interface IReadingSection {
    sectionNumber: number; // 1, 2, or 3
    title: string;

    // The reading passage text
    passage: string;

    // Passage source info
    passageSource?: string;

    // For academic: paragraphs labeled A, B, C, etc.
    paragraphs?: Array<{
        label: string;  // A, B, C, etc.
        text: string;
    }>;

    // Instructions
    instructions: string;

    // Image if passage has diagram/chart
    imageUrl?: string;

    // Questions for this passage
    questions: IReadingQuestion[];

    // Question groups (e.g., "Questions 1-5: True/False/Not Given")
    questionGroups?: Array<{
        startQuestion: number;
        endQuestion: number;
        questionType: ReadingQuestionType;
        instructions: string;
        headings?: string[];  // For matching headings
        wordList?: string[];  // For summary with word bank
    }>;
}

// Main Reading Test interface
export interface IReadingTest {
    testId: string;
    testNumber: number;
    title: string;
    description?: string;

    // Test type
    testType: "academic" | "general-training";

    // Source
    source?: string;

    // 3 Sections (Passages)
    sections: IReadingSection[];

    // Metadata
    totalQuestions: number; // Should be 40
    totalMarks: number;
    duration: number; // 60 minutes
    difficulty: "easy" | "medium" | "hard";

    // Status
    isActive: boolean;
    usageCount: number;

    // Timestamps
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Input for creating reading test
export interface ICreateReadingTestInput {
    title: string;
    description?: string;
    testType?: "academic" | "general-training";
    source?: string;
    sections: IReadingSection[];
    difficulty?: "easy" | "medium" | "hard";
}

// Filters
export interface IReadingTestFilters {
    testType?: string;
    difficulty?: string;
    isActive?: boolean;
    searchTerm?: string;
}

// Band score conversion (IELTS Academic Reading)
export const READING_BAND_CONVERSION_ACADEMIC: Record<number, number> = {
    40: 9.0, 39: 9.0,
    38: 8.5, 37: 8.5,
    36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5,
    32: 7.0, 31: 7.0, 30: 7.0,
    29: 6.5, 28: 6.5, 27: 6.5,
    26: 6.0, 25: 6.0, 24: 6.0, 23: 6.0,
    22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5,
    18: 5.0, 17: 5.0, 16: 5.0, 15: 5.0,
    14: 4.5, 13: 4.5,
    12: 4.0, 11: 4.0, 10: 4.0,
    9: 3.5, 8: 3.5,
    7: 3.0, 6: 3.0,
    5: 2.5, 4: 2.5,
    3: 2.0, 2: 2.0,
    1: 1.0,
    0: 0
};

// Band score conversion (IELTS General Training Reading)
export const READING_BAND_CONVERSION_GT: Record<number, number> = {
    40: 9.0,
    39: 8.5,
    38: 8.0, 37: 8.0,
    36: 7.5, 35: 7.5, 34: 7.5,
    33: 7.0, 32: 7.0,
    31: 6.5, 30: 6.5,
    29: 6.0, 28: 6.0, 27: 6.0,
    26: 5.5, 25: 5.5, 24: 5.5, 23: 5.5,
    22: 5.0, 21: 5.0, 20: 5.0, 19: 5.0, 18: 5.0,
    17: 4.5, 16: 4.5, 15: 4.5,
    14: 4.0, 13: 4.0, 12: 4.0,
    11: 3.5, 10: 3.5, 9: 3.5,
    8: 3.0, 7: 3.0, 6: 3.0,
    5: 2.5, 4: 2.5,
    3: 2.0, 2: 2.0,
    1: 1.0,
    0: 0
};

// Helper function to get band score
export const getReadingBandScore = (
    correctAnswers: number,
    testType: "academic" | "general-training" = "academic"
): number => {
    if (correctAnswers > 40) correctAnswers = 40;
    if (correctAnswers < 0) correctAnswers = 0;

    const conversion = testType === "academic"
        ? READING_BAND_CONVERSION_ACADEMIC
        : READING_BAND_CONVERSION_GT;

    return conversion[correctAnswers] || 0;
};
