"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListeningRoutes = void 0;
const express_1 = require("express");
const listening_controller_1 = require("./listening.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// ============ PUBLIC ROUTES (For Exam) ============
// Get listening test for exam (without answers)
router.get("/exam/:testNumber", listening_controller_1.ListeningController.getListeningTestForExam);
// Grade listening answers
router.post("/grade", listening_controller_1.ListeningController.gradeListeningAnswers);
// ============ ADMIN ROUTES ============
// Get statistics
router.get("/statistics", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.getStatistics);
// Get test summary for dropdown
router.get("/summary", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.getTestSummary);
// Create new listening test
router.post("/", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.createListeningTest);
// Get all listening tests
router.get("/", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.getAllListeningTests);
// Get listening test by ID
router.get("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.getListeningTestById);
// Update listening test
router.patch("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.updateListeningTest);
// Toggle active status
router.patch("/:id/toggle-active", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.toggleActive);
// Delete listening test
router.delete("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), listening_controller_1.ListeningController.deleteListeningTest);
exports.ListeningRoutes = router;
