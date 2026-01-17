import { Router } from "express";
import { QuestionSetController } from "./questionSet.controller";
import { auth, authorize } from "../../middlewares/auth";

const router = Router();

// ============ PUBLIC ROUTES (For Exam) ============

// Get question set for exam (without answers)
router.get(
    "/exam/:setType/:setNumber",
    QuestionSetController.getQuestionSetForExam
);

// ============ ADMIN ROUTES ============

// Get statistics
router.get(
    "/statistics",
    auth,
    authorize("admin"),
    QuestionSetController.getStatistics
);

// Get set summary for dropdown
router.get(
    "/summary/:setType",
    auth,
    authorize("admin"),
    QuestionSetController.getSetSummary
);

// Create new question set
router.post(
    "/",
    auth,
    authorize("admin"),
    QuestionSetController.createQuestionSet
);

// Get all question sets
router.get(
    "/",
    auth,
    authorize("admin"),
    QuestionSetController.getAllQuestionSets
);

// Get question set by ID
router.get(
    "/:id",
    auth,
    authorize("admin"),
    QuestionSetController.getQuestionSetById
);

// Update question set
router.patch(
    "/:id",
    auth,
    authorize("admin"),
    QuestionSetController.updateQuestionSet
);

// Toggle active status
router.patch(
    "/:id/toggle-active",
    auth,
    authorize("admin"),
    QuestionSetController.toggleActive
);

// Delete question set
router.delete(
    "/:id",
    auth,
    authorize("admin"),
    QuestionSetController.deleteQuestionSet
);

export const QuestionSetRoutes = router;
