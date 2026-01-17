import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ExamSessionService } from "./examSession.service";

const startExam = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamSessionService.startExam(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: result.message,
        data: result.session,
    });
});

const getSession = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamSessionService.getSession(req.params.sessionId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Session retrieved successfully",
        data: result,
    });
});

const submitAnswers = catchAsync(async (req: Request, res: Response) => {
    const { section, answers } = req.body;
    const result = await ExamSessionService.submitAnswers(
        req.params.sessionId,
        section,
        answers
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `${section} answers submitted successfully`,
        data: result,
    });
});

const getResult = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamSessionService.getResult(req.params.sessionId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Result retrieved successfully",
        data: result,
    });
});

const getAllSessions = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamSessionService.getAllSessions(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Sessions retrieved successfully",
        data: result,
    });
});

const updateWritingScores = catchAsync(async (req: Request, res: Response) => {
    const { task1Band, task2Band } = req.body;
    const result = await ExamSessionService.updateWritingScores(
        req.params.sessionId,
        task1Band,
        task2Band
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Writing scores updated successfully",
        data: result,
    });
});

export const ExamSessionController = {
    startExam,
    getSession,
    submitAnswers,
    getResult,
    getAllSessions,
    updateWritingScores,
};
