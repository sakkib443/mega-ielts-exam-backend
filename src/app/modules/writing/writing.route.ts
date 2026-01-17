import { Router } from "express";
import { WritingController } from "./writing.controller";
import { auth, authorize } from "../../middlewares/auth";

const router = Router();

// ============ PUBLIC ROUTES (For Exam) ============

// Get writing test for exam (without sample answers)
router.get(
    "/exam/:testNumber",
    WritingController.getWritingTestForExam
);

// Submit writing response
router.post(
    "/submit",
    WritingController.submitWritingResponse
);

// ============ ADMIN/EXAMINER ROUTES ============

// Get statistics
router.get(
    "/statistics",
    auth,
    authorize("admin"),
    WritingController.getStatistics
);

// Get test summary for dropdown
router.get(
    "/summary",
    auth,
    authorize("admin"),
    WritingController.getTestSummary
);

// Get pending submissions for marking
router.get(
    "/submissions/pending",
    auth,
    authorize("admin"),
    WritingController.getPendingSubmissions
);

// Mark a submission
router.patch(
    "/submissions/:id/mark",
    auth,
    authorize("admin"),
    WritingController.markWritingSubmission
);

// Create new writing test
router.post(
    "/",
    auth,
    authorize("admin"),
    WritingController.createWritingTest
);

// Get all writing tests
router.get(
    "/",
    auth,
    authorize("admin"),
    WritingController.getAllWritingTests
);

// Get writing test by ID
router.get(
    "/:id",
    auth,
    authorize("admin"),
    WritingController.getWritingTestById
);

// Update writing test
router.patch(
    "/:id",
    auth,
    authorize("admin"),
    WritingController.updateWritingTest
);

// Toggle active status
router.patch(
    "/:id/toggle-active",
    auth,
    authorize("admin"),
    WritingController.toggleActive
);

// Delete writing test
router.delete(
    "/:id",
    auth,
    authorize("admin"),
    WritingController.deleteWritingTest
);

export const WritingRoutes = router;
