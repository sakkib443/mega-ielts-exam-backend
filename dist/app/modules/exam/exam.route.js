"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRoutes = void 0;
const express_1 = require("express");
const exam_controller_1 = require("./exam.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const exam_validation_1 = require("./exam.validation");
const router = (0, express_1.Router)();
// Public routes
router.get("/", exam_controller_1.ExamController.getAllExams);
router.get("/:examId", exam_controller_1.ExamController.getExamById);
// Admin only routes
router.post("/", auth_1.auth, (0, auth_1.authorize)("admin"), (0, validateRequest_1.default)(exam_validation_1.createExamValidation), exam_controller_1.ExamController.createExam);
router.put("/:examId", auth_1.auth, (0, auth_1.authorize)("admin"), (0, validateRequest_1.default)(exam_validation_1.updateExamValidation), exam_controller_1.ExamController.updateExam);
router.delete("/:examId", auth_1.auth, (0, auth_1.authorize)("admin"), exam_controller_1.ExamController.deleteExam);
exports.ExamRoutes = router;
