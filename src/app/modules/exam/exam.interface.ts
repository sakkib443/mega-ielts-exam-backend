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
    | "diagram-labeling";

export interface IQuestion {
    questionNumber: number;
    questionType: QuestionType;
    questionText: string;
    options?: string[];
    correctAnswer: string | string[];
    audioTimestamp?: string; // For listening questions
    passage?: string; // For reading questions
    imageUrl?: string; // For diagram questions
}

export interface ISection {
    sectionNumber: number;
    title: string;
    instructions: string;
    audioUrl?: string; // For listening sections
    passage?: string; // For reading sections
    questions: IQuestion[];
}

export interface IWritingTask {
    taskNumber: number;
    taskType: "task1" | "task2";
    prompt: string;
    imageUrl?: string; // For Task 1 (graph, chart, diagram)
    minWords: number;
}

export interface IExam {
    examId: string;
    title: string;
    description?: string;
    listening: {
        sections: ISection[];
        duration: number; // in minutes
        totalQuestions: number;
    };
    reading: {
        sections: ISection[];
        duration: number;
        totalQuestions: number;
    };
    writing: {
        tasks: IWritingTask[];
        duration: number;
    };
    speaking?: {
        parts: any[];
        duration: number;
    };
    isActive: boolean;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
