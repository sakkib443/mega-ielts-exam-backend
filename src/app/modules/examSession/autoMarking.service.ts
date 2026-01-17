import { IAnswer } from "./examSession.interface";
import { ISection } from "../exam/exam.interface";

// IELTS Band Score Conversion Table (for Listening and Reading)
const bandScoreTable = [
    { min: 39, max: 40, band: 9.0 },
    { min: 37, max: 38, band: 8.5 },
    { min: 35, max: 36, band: 8.0 },
    { min: 33, max: 34, band: 7.5 },
    { min: 30, max: 32, band: 7.0 },
    { min: 27, max: 29, band: 6.5 },
    { min: 23, max: 26, band: 6.0 },
    { min: 20, max: 22, band: 5.5 },
    { min: 16, max: 19, band: 5.0 },
    { min: 13, max: 15, band: 4.5 },
    { min: 10, max: 12, band: 4.0 },
    { min: 7, max: 9, band: 3.5 },
    { min: 5, max: 6, band: 3.0 },
    { min: 3, max: 4, band: 2.5 },
    { min: 1, max: 2, band: 2.0 },
    { min: 0, max: 0, band: 0 },
];

// Convert raw score to band score
export const convertToBandScore = (rawScore: number): number => {
    for (const range of bandScoreTable) {
        if (rawScore >= range.min && rawScore <= range.max) {
            return range.band;
        }
    }
    return 0;
};

// Normalize answer for comparison (trim, lowercase)
const normalizeAnswer = (answer: string): string => {
    return answer.toString().trim().toLowerCase();
};

// Check if user answer matches correct answer
const isCorrect = (
    userAnswer: string | string[],
    correctAnswer: string | string[]
): boolean => {
    // Handle array answers (matching questions)
    if (Array.isArray(correctAnswer)) {
        if (Array.isArray(userAnswer)) {
            // Both are arrays - check if all match
            if (userAnswer.length !== correctAnswer.length) return false;
            return userAnswer.every(
                (ans, idx) =>
                    normalizeAnswer(ans) === normalizeAnswer(correctAnswer[idx])
            );
        }
        // User gave single answer but correct is array - check if any match
        return correctAnswer.some(
            (correct) => normalizeAnswer(userAnswer) === normalizeAnswer(correct)
        );
    }

    // Single answer comparison
    const normalizedUser = normalizeAnswer(
        Array.isArray(userAnswer) ? userAnswer[0] : userAnswer
    );
    const normalizedCorrect = normalizeAnswer(correctAnswer);

    return normalizedUser === normalizedCorrect;
};

// Calculate raw score for a section
export const calculateSectionScore = (
    userAnswers: IAnswer[],
    sections: ISection[]
): number => {
    let correctCount = 0;

    // Flatten all questions from sections
    const allQuestions = sections.flatMap((section) => section.questions);

    for (const userAnswer of userAnswers) {
        const question = allQuestions.find(
            (q) => q.questionNumber === userAnswer.questionNumber
        );

        if (question && isCorrect(userAnswer.answer, question.correctAnswer)) {
            correctCount++;
        }
    }

    return correctCount;
};

// Calculate overall band score (average of all sections, rounded to nearest 0.5)
export const calculateOverallBand = (bands: number[]): number => {
    const validBands = bands.filter((b) => b > 0);
    if (validBands.length === 0) return 0;

    const average = validBands.reduce((sum, b) => sum + b, 0) / validBands.length;
    return Math.round(average * 2) / 2; // Round to nearest 0.5
};

export const AutoMarkingService = {
    calculateSectionScore,
    convertToBandScore,
    calculateOverallBand,
};
