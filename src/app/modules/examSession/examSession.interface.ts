import { Types } from "mongoose";

export interface IExamUser {
    name: string;
    phone: string;
    nid: string;
}

export interface IAnswer {
    questionNumber: number;
    answer: string | string[];
}

export interface ISectionScore {
    raw: number;
    band: number;
}

export interface IExamSession {
    sessionId: string;
    examId: string;
    exam: Types.ObjectId;
    user: IExamUser;
    answers: {
        listening: IAnswer[];
        reading: IAnswer[];
        writing: {
            task1: string;
            task2: string;
        };
    };
    scores: {
        listening: ISectionScore;
        reading: ISectionScore;
        writing: {
            task1Band: number;
            task2Band: number;
            overallBand: number;
        };
        overall: number;
    };
    status: "not-started" | "in-progress" | "completed";
    currentSection: "listening" | "reading" | "writing" | "completed";
    startedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
