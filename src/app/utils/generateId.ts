import mongoose from "mongoose";

// Generate IELTS Exam ID format: BACIELTS250001
// BAC = BdCalling Academy, IELTS, YY = Year, NNNNN = Sequential number
export const generateExamId = async (): Promise<string> => {
    const year = new Date().getFullYear().toString().slice(-2); // "25" for 2025
    const prefix = `BACIELTS${year}`;

    // Get the count of existing exams to generate sequential number
    const ExamSession = mongoose.model("ExamSession");
    const count = await ExamSession.countDocuments();
    const sequentialNumber = (count + 1).toString().padStart(5, "0");

    return `${prefix}${sequentialNumber}`;
};

// Generate unique session access code
export const generateSessionCode = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
