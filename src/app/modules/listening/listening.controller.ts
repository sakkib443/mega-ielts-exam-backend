import { Request, Response } from "express";
import { ListeningService } from "./listening.service";

// Create new listening test
const createListeningTest = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user?.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await ListeningService.createListeningTest(req.body, adminId);

        res.status(201).json({
            success: true,
            message: "Listening test created successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create listening test",
        });
    }
};

// Get all listening tests
const getAllListeningTests = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, difficulty, isActive, searchTerm } = req.query;

        const filters = {
            difficulty: difficulty as string,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm as string,
        };

        const result = await ListeningService.getAllListeningTests(
            filters,
            Number(page),
            Number(limit)
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch listening tests",
        });
    }
};

// Get listening test by ID
const getListeningTestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const includeAnswers = req.query.includeAnswers === "true";

        const result = await ListeningService.getListeningTestById(id, includeAnswers);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Listening test not found",
        });
    }
};

// Get listening test for exam (public - no answers)
const getListeningTestForExam = async (req: Request, res: Response) => {
    try {
        const { testNumber } = req.params;

        const result = await ListeningService.getListeningTestForExam(Number(testNumber));

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Listening test not found",
        });
    }
};

// Grade listening answers
const gradeListeningAnswers = async (req: Request, res: Response) => {
    try {
        const { testNumber, answers } = req.body;

        if (!testNumber || !answers) {
            return res.status(400).json({
                success: false,
                message: "testNumber and answers are required",
            });
        }

        const result = await ListeningService.gradeListeningAnswers(testNumber, answers);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to grade answers",
        });
    }
};

// Update listening test
const updateListeningTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await ListeningService.updateListeningTest(id, req.body);

        res.json({
            success: true,
            message: "Listening test updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update listening test",
        });
    }
};

// Delete listening test
const deleteListeningTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await ListeningService.deleteListeningTest(id);

        res.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete listening test",
        });
    }
};

// Toggle active status
const toggleActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await ListeningService.toggleActive(id);

        res.json({
            success: true,
            message: result.message,
            data: { isActive: result.isActive },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to toggle status",
        });
    }
};

// Get test summary for dropdown
const getTestSummary = async (req: Request, res: Response) => {
    try {
        const result = await ListeningService.getTestSummary();

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch summary",
        });
    }
};

// Get statistics
const getStatistics = async (req: Request, res: Response) => {
    try {
        const result = await ListeningService.getStatistics();

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch statistics",
        });
    }
};

export const ListeningController = {
    createListeningTest,
    getAllListeningTests,
    getListeningTestById,
    getListeningTestForExam,
    gradeListeningAnswers,
    updateListeningTest,
    deleteListeningTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
