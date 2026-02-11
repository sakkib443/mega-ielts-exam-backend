import { Router } from "express";
import { SpeakingController } from "./speaking.controller";
import { auth, authorize } from "../../middlewares/auth";

const router = Router();

// ============ PUBLIC ROUTES (For Exam) ============

// Get speaking test for exam
router.get(
    "/exam/:testNumber",
    SpeakingController.getSpeakingTestForExam
);

// ============ ADMIN ROUTES ============

// Get statistics
router.get(
    "/statistics",
    auth,
    authorize("admin"),
    SpeakingController.getStatistics
);

// Get test summary for dropdown
router.get(
    "/summary",
    auth,
    authorize("admin"),
    SpeakingController.getTestSummary
);

// Create new speaking test
router.post(
    "/",
    auth,
    authorize("admin"),
    SpeakingController.createSpeakingTest
);

// Get all speaking tests
router.get(
    "/",
    auth,
    authorize("admin"),
    SpeakingController.getAllSpeakingTests
);

// Get speaking test by ID
router.get(
    "/:id",
    auth,
    authorize("admin"),
    SpeakingController.getSpeakingTestById
);

// Update speaking test
router.patch(
    "/:id",
    auth,
    authorize("admin"),
    SpeakingController.updateSpeakingTest
);

// Toggle active status
router.patch(
    "/:id/toggle-active",
    auth,
    authorize("admin"),
    SpeakingController.toggleActive
);

// Delete speaking test
router.delete(
    "/:id",
    auth,
    authorize("admin"),
    SpeakingController.deleteSpeakingTest
);

export const SpeakingRoutes = router;
