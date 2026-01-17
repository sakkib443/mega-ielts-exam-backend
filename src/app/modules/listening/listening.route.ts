import { Router } from "express";
import { ListeningController } from "./listening.controller";
import { auth, authorize } from "../../middlewares/auth";

const router = Router();

// ============ PUBLIC ROUTES (For Exam) ============

// Get listening test for exam (without answers)
router.get(
    "/exam/:testNumber",
    ListeningController.getListeningTestForExam
);

// Grade listening answers
router.post(
    "/grade",
    ListeningController.gradeListeningAnswers
);

// ============ ADMIN ROUTES ============

// Get statistics
router.get(
    "/statistics",
    auth,
    authorize("admin"),
    ListeningController.getStatistics
);

// Get test summary for dropdown
router.get(
    "/summary",
    auth,
    authorize("admin"),
    ListeningController.getTestSummary
);

// Create new listening test
router.post(
    "/",
    auth,
    authorize("admin"),
    ListeningController.createListeningTest
);

// Get all listening tests
router.get(
    "/",
    auth,
    authorize("admin"),
    ListeningController.getAllListeningTests
);

// Get listening test by ID
router.get(
    "/:id",
    auth,
    authorize("admin"),
    ListeningController.getListeningTestById
);

// Update listening test
router.patch(
    "/:id",
    auth,
    authorize("admin"),
    ListeningController.updateListeningTest
);

// Toggle active status
router.patch(
    "/:id/toggle-active",
    auth,
    authorize("admin"),
    ListeningController.toggleActive
);

// Delete listening test
router.delete(
    "/:id",
    auth,
    authorize("admin"),
    ListeningController.deleteListeningTest
);

export const ListeningRoutes = router;
