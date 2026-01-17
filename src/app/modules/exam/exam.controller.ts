import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ExamService } from "./exam.service";

const createExam = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.createExam(req.body, req.user._id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Exam created successfully",
        data: result,
    });
});

const getAllExams = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.getAllExams(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Exams retrieved successfully",
        data: result,
    });
});

const getExamById = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.getExamById(req.params.examId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Exam retrieved successfully",
        data: result,
    });
});

const updateExam = catchAsync(async (req: Request, res: Response) => {
    const result = await ExamService.updateExam(req.params.examId, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Exam updated successfully",
        data: result,
    });
});

const deleteExam = catchAsync(async (req: Request, res: Response) => {
    await ExamService.deleteExam(req.params.examId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Exam deleted successfully",
        data: null,
    });
});

export const ExamController = {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
};
