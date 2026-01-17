"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const exam_route_1 = require("../modules/exam/exam.route");
const examSession_route_1 = require("../modules/examSession/examSession.route");
const student_route_1 = require("../modules/student/student.route");
const questionSet_route_1 = require("../modules/questionSet/questionSet.route");
const upload_route_1 = require("../modules/upload/upload.route");
// New separate modules for each exam type
const listening_route_1 = require("../modules/listening/listening.route");
const reading_route_1 = require("../modules/reading/reading.route");
const writing_route_1 = require("../modules/writing/writing.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/exams",
        route: exam_route_1.ExamRoutes,
    },
    {
        path: "/exam-sessions",
        route: examSession_route_1.ExamSessionRoutes,
    },
    {
        path: "/students",
        route: student_route_1.StudentRoutes,
    },
    {
        path: "/question-sets",
        route: questionSet_route_1.QuestionSetRoutes,
    },
    {
        path: "/upload",
        route: upload_route_1.UploadRoutes,
    },
    // New separate modules for each exam type
    {
        path: "/listening",
        route: listening_route_1.ListeningRoutes,
    },
    {
        path: "/reading",
        route: reading_route_1.ReadingRoutes,
    },
    {
        path: "/writing",
        route: writing_route_1.WritingRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
