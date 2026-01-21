import { Types } from "mongoose";

// Exam status for a student
export type ExamStatus =
    | "not-started"
    | "in-progress"
    | "completed"
    | "terminated"
    | "expired";

// Payment method types
export type PaymentMethod = "cash" | "bkash" | "nagad" | "bank" | "other";

// Payment status
export type PaymentStatus = "pending" | "paid" | "refunded";

// Assigned question sets for the student
export interface IAssignedSets {
    listeningSetId?: Types.ObjectId;
    listeningSetNumber?: number;
    readingSetId?: Types.ObjectId;
    readingSetNumber?: number;
    writingSetId?: Types.ObjectId;
    writingSetNumber?: number;
}

// Exam result scores
export interface IExamScores {
    listening: {
        raw: number;
        band: number;
        correctAnswers: number;
        totalQuestions: number;
    };
    reading: {
        raw: number;
        band: number;
        correctAnswers: number;
        totalQuestions: number;
    };
    writing: {
        task1Band: number;
        task2Band: number;
        overallBand: number;
    };
    overall: number;
}

// Violation record
export interface IViolation {
    type: "tab-switch" | "fullscreen-exit" | "browser-close" | "refresh" | "dev-tools" | "other";
    timestamp: Date;
    count: number;
    action: "warning" | "deduction" | "terminated";
}

// Main Student interface
export interface IStudent {
    // Unique exam ID (BACIELTS260001 format)
    examId: string;

    // Personal information
    nameEnglish: string;
    nameBengali?: string;
    email: string;
    phone: string;
    nidNumber?: string; // Voter ID / NID
    photo?: string;

    // Auto-generated account credentials
    password: string; // Auto-generated (same as email or phone)

    // Payment information
    paymentStatus: PaymentStatus;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
    paymentDate?: Date;
    paymentReference?: string;

    // Exam assignment
    examDate: Date;
    assignedSets: IAssignedSets;

    // Exam session tracking
    examStatus: ExamStatus;
    examSessionId?: string;
    examStartedAt?: Date;
    examCompletedAt?: Date;

    // Exam scores and results
    scores?: IExamScores;

    // Track completed modules
    completedModules?: ("listening" | "reading" | "writing" | "LISTENING" | "READING" | "WRITING")[];

    // Store student's exam answers for each module
    examAnswers?: {
        listening?: {
            questionNumber: number;
            studentAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
        }[];
        reading?: {
            questionNumber: number;
            studentAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
        }[];
        writing?: {
            task1?: string;
            task2?: string;
        };
    };

    // Security & violations
    violations: IViolation[];
    totalViolations: number;
    ipAddress?: string;
    browserFingerprint?: string;

    // Status flags
    isActive: boolean;
    canRetake: boolean; // Admin can reset this
    resultsPublished: boolean; // When true, students can see their results
    adminRemarks?: string; // Admin comments on the exam

    // Linked user account (auto-created)
    userId?: Types.ObjectId;

    // Metadata
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Create student input (from admin)
export interface ICreateStudentInput {
    nameEnglish: string;
    nameBengali?: string;
    email: string;
    phone: string;
    nidNumber?: string;
    photo?: string;
    paymentStatus: PaymentStatus;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
    paymentDate?: Date;
    paymentReference?: string;
    examDate: Date;
    listeningSetNumber?: number;
    readingSetNumber?: number;
    writingSetNumber?: number;
}

// Verify exam ID input
export interface IVerifyExamIdInput {
    examId: string;
}

// Student filters for listing
export interface IStudentFilters {
    searchTerm?: string;
    examStatus?: ExamStatus;
    paymentStatus?: PaymentStatus;
    examDate?: string;
    fromDate?: string;
    toDate?: string;
}
