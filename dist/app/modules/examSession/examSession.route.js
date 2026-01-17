"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSessionRoutes = void 0;
const express_1 = require("express");
const examSession_controller_1 = require("./examSession.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const examSession_validation_1 = require("./examSession.validation");
const router = (0, express_1.Router)();
// Public routes - No auth required for taking exam
router.post("/start", (0, validateRequest_1.default)(examSession_validation_1.startExamValidation), examSession_controller_1.ExamSessionController.startExam);
router.get("/:sessionId", examSession_controller_1.ExamSessionController.getSession);
router.post("/:sessionId/submit", (0, validateRequest_1.default)(examSession_validation_1.submitAnswersValidation), examSession_controller_1.ExamSessionController.submitAnswers);
router.get("/:sessionId/result", examSession_controller_1.ExamSessionController.getResult);
// Admin routes
router.get("/", auth_1.auth, (0, auth_1.authorize)("admin"), examSession_controller_1.ExamSessionController.getAllSessions);
router.patch("/:sessionId/writing-scores", auth_1.auth, (0, auth_1.authorize)("admin"), examSession_controller_1.ExamSessionController.updateWritingScores);
exports.ExamSessionRoutes = router;
