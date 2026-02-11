import { Types } from "mongoose";

/**
 * IELTS Speaking Test Structure
 * 
 * Part 1: Introduction & Interview (4-5 minutes)
 *   - General questions on familiar topics (home, work, studies, hobbies)
 *   - 3-4 questions per topic, usually 2 topics
 * 
 * Part 2: Individual Long Turn / Cue Card (3-4 minutes)
 *   - 1 minute preparation, 1-2 minutes speaking
 *   - Topic card with "You should say" bullet points
 *   - May have 1-2 follow-up questions
 * 
 * Part 3: Two-way Discussion (4-5 minutes)
 *   - Related to Part 2 topic but more abstract/complex
 *   - 4-6 deeper discussion questions
 */

// Part 1: Introduction & Interview
export interface ISpeakingPart1Topic {
    topicName: string; // e.g., "History", "Hobbies", "Work"
    questions: string[]; // Array of questions for this topic
}

export interface ISpeakingPart1 {
    topics: ISpeakingPart1Topic[]; // Usually 2 topics with 3-4 questions each
    duration: number; // 4-5 minutes
}

// Part 2: Cue Card / Long Turn
export interface ISpeakingPart2 {
    topic: string; // e.g., "Describe the neighbourhood you lived in as a child"
    cueCard: string; // Full cue card text
    bulletPoints: string[]; // "You should say" points (3-4 points)
    followUpQuestion?: string; // "and explain whether..." 
    preparationTime: number; // in seconds, usually 60
    speakingTime: number; // in seconds, usually 120
    followUpQuestions?: string[]; // Optional follow-up questions after main answer
}

// Part 3: Two-way Discussion
export interface ISpeakingPart3 {
    topic: string; // Related to Part 2 topic, e.g., "Neighbourhoods & Communities"
    questions: string[]; // 4-6 discussion questions
    duration: number; // 4-5 minutes
}

// Main Speaking Test interface
export interface ISpeakingTest {
    // Identification
    testId: string; // SPEAKING_001, SPEAKING_002, etc.
    testNumber: number;
    title: string;
    description?: string;

    // Source (e.g., "Cambridge IELTS Book 17 Test 1")
    source?: string;

    // 3 Parts
    part1: ISpeakingPart1;
    part2: ISpeakingPart2;
    part3: ISpeakingPart3;

    // Total questions count
    totalQuestions: number;

    // Metadata
    duration: number; // in minutes (11-14 total)
    difficulty: "easy" | "medium" | "hard";

    // Status
    isActive: boolean;
    usageCount: number;

    // Timestamps
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Input for creating speaking test
export interface ICreateSpeakingTestInput {
    title: string;
    description?: string;
    source?: string;
    part1: ISpeakingPart1;
    part2: ISpeakingPart2;
    part3: ISpeakingPart3;
    difficulty?: "easy" | "medium" | "hard";
}

// Filters for listing
export interface ISpeakingTestFilters {
    difficulty?: string;
    isActive?: boolean;
    searchTerm?: string;
}
