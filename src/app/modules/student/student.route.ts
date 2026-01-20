import { Router } from "express";
import { StudentController } from "./student.controller";
import { auth, authorize } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidation } from "./student.validation";
// Routes updated with resetModule

const router = Router();

// ============ PUBLIC ROUTES (For Exam Entry) ============

// Verify exam ID - Used on exam entry page
router.post(
    "/verify",
    validateRequest(StudentValidation.verifyExamIdSchema),
    StudentController.verifyExamId
);

// Start exam session
router.post(
    "/start-exam",
    validateRequest(StudentValidation.startExamSchema),
    StudentController.startExam
);

// Report violation during exam
router.post(
    "/violation",
    validateRequest(StudentValidation.reportViolationSchema),
    StudentController.reportViolation
);

// Get exam results by exam ID (for result page after exam)
router.get("/results/:examId", StudentController.getExamResults);

// Complete exam and save scores (public - called when exam finishes)
router.post("/complete-exam", StudentController.completeExam);

// Save individual module score (public - called after each module)
router.post("/save-module-score", StudentController.saveModuleScore);

// ============ PROTECTED ROUTES (Require Authentication) ============

// Get student by exam ID
router.get("/exam/:examId", auth, StudentController.getStudentByExamId);

// ============ ADMIN ROUTES ============

// Get statistics for dashboard
router.get(
    "/statistics",
    auth,
    authorize("admin"),
    StudentController.getStatistics
);

// Get all results (admin)
router.get(
    "/all-results",
    auth,
    authorize("admin"),
    StudentController.getAllResults
);

// Create new student (admin)
router.post(
    "/",
    auth,
    authorize("admin"),
    validateRequest(StudentValidation.createStudentSchema),
    StudentController.createStudent
);

// Get all students (admin)
router.get("/", auth, authorize("admin"), StudentController.getAllStudents);

// Get student by ID (admin)
router.get("/:id", auth, authorize("admin"), StudentController.getStudentById);

// Update student (admin)
router.patch(
    "/:id",
    auth,
    authorize("admin"),
    validateRequest(StudentValidation.updateStudentSchema),
    StudentController.updateStudent
);

// Delete student (admin)
router.delete("/:id", auth, authorize("admin"), StudentController.deleteStudent);

// Reset exam for student (admin)
router.post(
    "/reset/:examId",
    auth,
    authorize("admin"),
    StudentController.resetExam
);

// Update score for a module (admin)
router.patch(
    "/:id/update-score",
    auth,
    authorize("admin"),
    StudentController.updateScore
);

// Get answer sheet for a module (admin)
router.get(
    "/:id/answer-sheet/:module",
    auth,
    authorize("admin"),
    StudentController.getAnswerSheet
);

// Update all scores at once (admin)
router.patch(
    "/:id/update-all-scores",
    auth,
    authorize("admin"),
    StudentController.updateAllScores
);

// Publish results for student (admin)
router.post(
    "/:id/publish-results",
    auth,
    authorize("admin"),
    StudentController.publishResults
);

// Reset individual module (admin)
router.post(
    "/:id/reset-module",
    auth,
    authorize("admin"),
    StudentController.resetModule
);

export const StudentRoutes = router;

