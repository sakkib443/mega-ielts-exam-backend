"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = require("express");
const student_controller_1 = require("./student.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const student_validation_1 = require("./student.validation");
const router = (0, express_1.Router)();
// ============ PUBLIC ROUTES (For Exam Entry) ============
// Verify exam ID - Used on exam entry page
router.post("/verify", (0, validateRequest_1.default)(student_validation_1.StudentValidation.verifyExamIdSchema), student_controller_1.StudentController.verifyExamId);
// Start exam session
router.post("/start-exam", (0, validateRequest_1.default)(student_validation_1.StudentValidation.startExamSchema), student_controller_1.StudentController.startExam);
// Report violation during exam
router.post("/violation", (0, validateRequest_1.default)(student_validation_1.StudentValidation.reportViolationSchema), student_controller_1.StudentController.reportViolation);
// Get exam results by exam ID (for result page after exam)
router.get("/results/:examId", student_controller_1.StudentController.getExamResults);
// Complete exam and save scores (public - called when exam finishes)
router.post("/complete-exam", student_controller_1.StudentController.completeExam);
// Save individual module score (public - called after each module)
router.post("/save-module-score", student_controller_1.StudentController.saveModuleScore);
// ============ PROTECTED ROUTES (Require Authentication) ============
// Get student by exam ID
router.get("/exam/:examId", auth_1.auth, student_controller_1.StudentController.getStudentByExamId);
// ============ ADMIN ROUTES ============
// Get statistics for dashboard
router.get("/statistics", auth_1.auth, (0, auth_1.authorize)("admin"), student_controller_1.StudentController.getStatistics);
// Get all results (admin)
router.get("/all-results", auth_1.auth, (0, auth_1.authorize)("admin"), student_controller_1.StudentController.getAllResults);
// Create new student (admin)
router.post("/", auth_1.auth, (0, auth_1.authorize)("admin"), (0, validateRequest_1.default)(student_validation_1.StudentValidation.createStudentSchema), student_controller_1.StudentController.createStudent);
// Get all students (admin)
router.get("/", auth_1.auth, (0, auth_1.authorize)("admin"), student_controller_1.StudentController.getAllStudents);
// Get student by ID (admin)
router.get("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), student_controller_1.StudentController.getStudentById);
// Update student (admin)
router.patch("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), (0, validateRequest_1.default)(student_validation_1.StudentValidation.updateStudentSchema), student_controller_1.StudentController.updateStudent);
// Delete student (admin)
router.delete("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), student_controller_1.StudentController.deleteStudent);
// Reset exam for student (admin)
router.post("/reset/:examId", auth_1.auth, (0, auth_1.authorize)("admin"), student_controller_1.StudentController.resetExam);
exports.StudentRoutes = router;
