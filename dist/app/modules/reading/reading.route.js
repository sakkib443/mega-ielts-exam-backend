"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingRoutes = void 0;
const express_1 = require("express");
const reading_controller_1 = require("./reading.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// ============ PUBLIC ROUTES (For Exam) ============
// Get reading test for exam (without answers)
router.get("/exam/:testNumber", reading_controller_1.ReadingController.getReadingTestForExam);
// Grade reading answers
router.post("/grade", reading_controller_1.ReadingController.gradeReadingAnswers);
// ============ ADMIN ROUTES ============
// Get statistics
router.get("/statistics", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.getStatistics);
// Get test summary for dropdown
router.get("/summary", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.getTestSummary);
// Create new reading test
router.post("/", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.createReadingTest);
// Get all reading tests
router.get("/", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.getAllReadingTests);
// Get reading test by ID
router.get("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.getReadingTestById);
// Update reading test
router.patch("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.updateReadingTest);
// Toggle active status
router.patch("/:id/toggle-active", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.toggleActive);
// Delete reading test
router.delete("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), reading_controller_1.ReadingController.deleteReadingTest);
exports.ReadingRoutes = router;
