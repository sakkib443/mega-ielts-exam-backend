import { IAnswer } from "./examSession.interface";
import { ISection } from "../exam/exam.interface";

// Official IELTS Listening Band Score Conversion Table (out of 40)
const LISTENING_BAND_TABLE = [
    { min: 39, max: 40, band: 9.0 },
    { min: 37, max: 38, band: 8.5 },
    { min: 35, max: 36, band: 8.0 },
    { min: 32, max: 34, band: 7.5 },
    { min: 30, max: 31, band: 7.0 },
    { min: 26, max: 29, band: 6.5 },
    { min: 23, max: 25, band: 6.0 },
    { min: 18, max: 22, band: 5.5 },
    { min: 16, max: 17, band: 5.0 },
    { min: 13, max: 15, band: 4.5 },
    { min: 10, max: 12, band: 4.0 },
    { min: 6, max: 9, band: 3.5 },
    { min: 4, max: 5, band: 3.0 },
    { min: 3, max: 3, band: 2.5 },
    { min: 2, max: 2, band: 2.0 },
    { min: 1, max: 1, band: 1.0 },
    { min: 0, max: 0, band: 0 },
];

// Official IELTS Academic Reading Band Score Conversion Table (out of 40)
const READING_ACADEMIC_BAND_TABLE = [
    { min: 39, max: 40, band: 9.0 },
    { min: 37, max: 38, band: 8.5 },
    { min: 35, max: 36, band: 8.0 },
    { min: 33, max: 34, band: 7.5 },
    { min: 30, max: 32, band: 7.0 },
    { min: 27, max: 29, band: 6.5 },
    { min: 23, max: 26, band: 6.0 },
    { min: 19, max: 22, band: 5.5 },
    { min: 15, max: 18, band: 5.0 },
    { min: 13, max: 14, band: 4.5 },
    { min: 10, max: 12, band: 4.0 },
    { min: 8, max: 9, band: 3.5 },
    { min: 6, max: 7, band: 3.0 },
    { min: 4, max: 5, band: 2.5 },
    { min: 2, max: 3, band: 2.0 },
    { min: 1, max: 1, band: 1.0 },
    { min: 0, max: 0, band: 0 },
];

// Official IELTS General Training Reading Band Score Conversion Table (out of 40)
const READING_GT_BAND_TABLE = [
    { min: 40, max: 40, band: 9.0 },
    { min: 39, max: 39, band: 8.5 },
    { min: 37, max: 38, band: 8.0 },
    { min: 36, max: 36, band: 7.5 },
    { min: 34, max: 35, band: 7.0 },
    { min: 32, max: 33, band: 6.5 },
    { min: 30, max: 31, band: 6.0 },
    { min: 27, max: 29, band: 5.5 },
    { min: 23, max: 26, band: 5.0 },
    { min: 19, max: 22, band: 4.5 },
    { min: 15, max: 18, band: 4.0 },
    { min: 12, max: 14, band: 3.5 },
    { min: 9, max: 11, band: 3.0 },
    { min: 6, max: 8, band: 2.5 },
    { min: 3, max: 5, band: 2.0 },
    { min: 1, max: 2, band: 1.0 },
    { min: 0, max: 0, band: 0 },
];

// Convert raw score to band score
export const convertToBandScore = (
    rawScore: number,
    type: "listening" | "reading",
    testType: "academic" | "general-training" = "academic"
): number => {
    let table = LISTENING_BAND_TABLE;

    if (type === "reading") {
        table = testType === "academic" ? READING_ACADEMIC_BAND_TABLE : READING_GT_BAND_TABLE;
    }

    // Clamp raw score
    const score = Math.max(0, Math.min(40, Math.round(rawScore)));

    for (const range of table) {
        if (score >= range.min && score <= range.max) {
            return range.band;
        }
    }
    return 0;
};

// Normalize answer for comparison (trim, lowercase, handle multiple spaces)
const normalizeAnswer = (answer: string | number | undefined | null): string => {
    if (answer === undefined || answer === null) return "";
    return answer.toString().trim().toLowerCase().replace(/\s+/g, ' ');
};

// Check if user answer matches correct answer
const isCorrect = (
    userAnswer: string | string[],
    correctAnswer: string | string[]
): boolean => {
    // Handle array of correct answers (multiple possibilities)
    if (Array.isArray(correctAnswer)) {
        const normalizedUser = normalizeAnswer(Array.isArray(userAnswer) ? userAnswer[0] : userAnswer);
        if (normalizedUser === "") return false;

        return correctAnswer.some(
            (correct) => normalizeAnswer(correct) === normalizedUser
        );
    }

    // Handle single correct answer
    const normalizedUser = normalizeAnswer(Array.isArray(userAnswer) ? userAnswer[0] : userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);

    if (normalizedUser === "" || normalizedCorrect === "") return false;

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

// Calculate overall band score (average of all sections, rounded according to IELTS rules)
export const calculateOverallBand = (bands: number[]): number => {
    const validBands = bands.filter((b) => b > 0);
    if (validBands.length === 0) return 0;

    const average = validBands.reduce((sum, b) => sum + b, 0) / validBands.length;

    // IELTS rounding rule:
    // .0 - .24 => .0
    // .25 - .74 => .5
    // .75 - .99 => 1.0 (next whole number)

    const decimal = average % 1;
    if (decimal < 0.25) {
        return Math.floor(average);
    } else if (decimal < 0.75) {
        return Math.floor(average) + 0.5;
    } else {
        return Math.ceil(average);
    }
};

export const AutoMarkingService = {
    calculateSectionScore,
    convertToBandScore,
    calculateOverallBand,
    isCorrect,
    normalizeAnswer
};
