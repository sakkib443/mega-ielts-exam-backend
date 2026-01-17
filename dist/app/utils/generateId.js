"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSessionCode = exports.generateExamId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Generate IELTS Exam ID format: BACIELTS250001
// BAC = BdCalling Academy, IELTS, YY = Year, NNNNN = Sequential number
const generateExamId = () => __awaiter(void 0, void 0, void 0, function* () {
    const year = new Date().getFullYear().toString().slice(-2); // "25" for 2025
    const prefix = `BACIELTS${year}`;
    // Get the count of existing exams to generate sequential number
    const ExamSession = mongoose_1.default.model("ExamSession");
    const count = yield ExamSession.countDocuments();
    const sequentialNumber = (count + 1).toString().padStart(5, "0");
    return `${prefix}${sequentialNumber}`;
});
exports.generateExamId = generateExamId;
// Generate unique session access code
const generateSessionCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateSessionCode = generateSessionCode;
