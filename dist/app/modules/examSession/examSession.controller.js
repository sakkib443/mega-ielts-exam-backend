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
exports.ExamSessionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const examSession_service_1 = require("./examSession.service");
const startExam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield examSession_service_1.ExamSessionService.startExam(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: result.message,
        data: result.session,
    });
}));
const getSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield examSession_service_1.ExamSessionService.getSession(req.params.sessionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Session retrieved successfully",
        data: result,
    });
}));
const submitAnswers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { section, answers } = req.body;
    const result = yield examSession_service_1.ExamSessionService.submitAnswers(req.params.sessionId, section, answers);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `${section} answers submitted successfully`,
        data: result,
    });
}));
const getResult = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield examSession_service_1.ExamSessionService.getResult(req.params.sessionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Result retrieved successfully",
        data: result,
    });
}));
const getAllSessions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield examSession_service_1.ExamSessionService.getAllSessions(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Sessions retrieved successfully",
        data: result,
    });
}));
const updateWritingScores = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task1Band, task2Band } = req.body;
    const result = yield examSession_service_1.ExamSessionService.updateWritingScores(req.params.sessionId, task1Band, task2Band);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Writing scores updated successfully",
        data: result,
    });
}));
exports.ExamSessionController = {
    startExam,
    getSession,
    submitAnswers,
    getResult,
    getAllSessions,
    updateWritingScores,
};
