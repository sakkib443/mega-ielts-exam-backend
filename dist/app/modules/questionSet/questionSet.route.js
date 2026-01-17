"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSetRoutes = void 0;
const express_1 = require("express");
const questionSet_controller_1 = require("./questionSet.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// ============ PUBLIC ROUTES (For Exam) ============
// Get question set for exam (without answers)
router.get("/exam/:setType/:setNumber", questionSet_controller_1.QuestionSetController.getQuestionSetForExam);
// ============ ADMIN ROUTES ============
// Get statistics
router.get("/statistics", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.getStatistics);
// Get set summary for dropdown
router.get("/summary/:setType", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.getSetSummary);
// Create new question set
router.post("/", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.createQuestionSet);
// Get all question sets
router.get("/", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.getAllQuestionSets);
// Get question set by ID
router.get("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.getQuestionSetById);
// Update question set
router.patch("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.updateQuestionSet);
// Toggle active status
router.patch("/:id/toggle-active", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.toggleActive);
// Delete question set
router.delete("/:id", auth_1.auth, (0, auth_1.authorize)("admin"), questionSet_controller_1.QuestionSetController.deleteQuestionSet);
exports.QuestionSetRoutes = router;
