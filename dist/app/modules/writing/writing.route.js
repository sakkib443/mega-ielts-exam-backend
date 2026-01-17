"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WritingRoutes = void 0;
const express_1 = require("express");
const writing_controller_1 = require("./writing.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// ============ PUBLIC ROUTES (For Exam) ============
// Get writing test for exam (without sample answers)
router.get("/exam/:testNumber", writing_controller_1.WritingController.getWritingTestForExam);
// Submit writing response
router.post("/submit", writing_controller_1.WritingController.submitWritingResponse);
// ============ ADMIN/EXAMINER ROUTES ============
// Get statistics
router.get("/statistics", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.getStatistics);
// Get test summary for dropdown
router.get("/summary", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.getTestSummary);
// Get pending submissions for marking
router.get("/submissions/pending", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.getPendingSubmissions);
// Mark a submission
router.patch("/submissions/:id/mark", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.markWritingSubmission);
// Create new writing test
router.post("/", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.createWritingTest);
// Get all writing tests
router.get("/", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.getAllWritingTests);
// Get writing test by ID
router.get("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.getWritingTestById);
// Update writing test
router.patch("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.updateWritingTest);
// Toggle active status
router.patch("/:id/toggle-active", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.toggleActive);
// Delete writing test
router.delete("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), writing_controller_1.WritingController.deleteWritingTest);
exports.WritingRoutes = router;
