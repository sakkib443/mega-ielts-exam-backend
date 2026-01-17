import { Request, Response } from "express";
import { QuestionSetService } from "./questionSet.service";

// Create new question set (Admin)
const createQuestionSet = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user?.id;
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await QuestionSetService.createQuestionSet(req.body, adminId);

        res.status(201).json({
            success: true,
            message: "Question set created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create question set",
        });
    }
};

// Get all question sets (Admin)
const getAllQuestionSets = async (req: Request, res: Response) => {
    try {
        const {
            setType,
            difficulty,
            isActive,
            searchTerm,
            page = "1",
            limit = "10",
        } = req.query;

        const filters = {
            setType: setType as any,
            difficulty: difficulty as string,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm as string,
        };

        const result = await QuestionSetService.getAllQuestionSets(
            filters,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.status(200).json({
            success: true,
            message: "Question sets retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get question sets",
        });
    }
};

// Get question set by ID (Admin - with answers)
const getQuestionSetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const includeAnswers = req.query.includeAnswers === "true";

        const set = await QuestionSetService.getQuestionSetById(id, includeAnswers);

        res.status(200).json({
            success: true,
            message: "Question set retrieved successfully",
            data: set,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || "Question set not found",
        });
    }
};

// Get question set for exam (without answers)
const getQuestionSetForExam = async (req: Request, res: Response) => {
    try {
        const { setType, setNumber } = req.params;

        const set = await QuestionSetService.getQuestionSetForExam(
            setType as any,
            parseInt(setNumber)
        );

        res.status(200).json({
            success: true,
            message: "Question set retrieved successfully",
            data: set,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || "Question set not found",
        });
    }
};

// Update question set (Admin)
const updateQuestionSet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await QuestionSetService.updateQuestionSet(id, req.body);

        res.status(200).json({
            success: true,
            message: "Question set updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update question set",
        });
    }
};

// Delete question set (Admin)
const deleteQuestionSet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await QuestionSetService.deleteQuestionSet(id);

        res.status(200).json({
            success: true,
            message: "Question set deleted successfully",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete question set",
        });
    }
};

// Toggle active status (Admin)
const toggleActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await QuestionSetService.toggleActive(id);

        res.status(200).json({
            success: true,
            message: result.message,
            data: { isActive: result.isActive },
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to toggle status",
        });
    }
};

// Get set summary for dropdown selection (Admin)
const getSetSummary = async (req: Request, res: Response) => {
    try {
        const { setType } = req.params;
        const sets = await QuestionSetService.getSetSummary(setType as any);

        res.status(200).json({
            success: true,
            message: "Set summary retrieved successfully",
            data: sets,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get set summary",
        });
    }
};

// Get statistics (Admin)
const getStatistics = async (req: Request, res: Response) => {
    try {
        const stats = await QuestionSetService.getStatistics();

        res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: stats,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get statistics",
        });
    }
};

export const QuestionSetController = {
    createQuestionSet,
    getAllQuestionSets,
    getQuestionSetById,
    getQuestionSetForExam,
    updateQuestionSet,
    deleteQuestionSet,
    toggleActive,
    getSetSummary,
    getStatistics,
};
