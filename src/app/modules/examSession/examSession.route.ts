import { Router } from "express";
import { ExamSessionController } from "./examSession.controller";
import { auth, authorize } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
    startExamValidation,
    submitAnswersValidation,
} from "./examSession.validation";

const router = Router();

// Public routes - No auth required for taking exam
router.post(
    "/start",
    validateRequest(startExamValidation),
    ExamSessionController.startExam
);

router.get("/:sessionId", ExamSessionController.getSession);

router.post(
    "/:sessionId/submit",
    validateRequest(submitAnswersValidation),
    ExamSessionController.submitAnswers
);

router.get("/:sessionId/result", ExamSessionController.getResult);

// Admin routes
router.get("/", auth, authorize("admin"), ExamSessionController.getAllSessions);

router.patch(
    "/:sessionId/writing-scores",
    auth,
    authorize("admin"),
    ExamSessionController.updateWritingScores
);

export const ExamSessionRoutes = router;
