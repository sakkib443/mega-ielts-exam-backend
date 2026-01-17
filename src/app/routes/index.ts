import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ExamRoutes } from "../modules/exam/exam.route";
import { ExamSessionRoutes } from "../modules/examSession/examSession.route";
import { StudentRoutes } from "../modules/student/student.route";
import { QuestionSetRoutes } from "../modules/questionSet/questionSet.route";
import { UploadRoutes } from "../modules/upload/upload.route";

// New separate modules for each exam type
import { ListeningRoutes } from "../modules/listening/listening.route";
import { ReadingRoutes } from "../modules/reading/reading.route";
import { WritingRoutes } from "../modules/writing/writing.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/exams",
        route: ExamRoutes,
    },
    {
        path: "/exam-sessions",
        route: ExamSessionRoutes,
    },
    {
        path: "/students",
        route: StudentRoutes,
    },
    {
        path: "/question-sets",
        route: QuestionSetRoutes,
    },
    {
        path: "/upload",
        route: UploadRoutes,
    },
    // New separate modules for each exam type
    {
        path: "/listening",
        route: ListeningRoutes,
    },
    {
        path: "/reading",
        route: ReadingRoutes,
    },
    {
        path: "/writing",
        route: WritingRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

