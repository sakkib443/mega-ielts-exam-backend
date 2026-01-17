import { Request, Response } from "express";
import { ReadingService } from "./reading.service";

// Create new reading test
const createReadingTest = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user?.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await ReadingService.createReadingTest(req.body, adminId);

        res.status(201).json({
            success: true,
            message: "Reading test created successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create reading test",
        });
    }
};

// Get all reading tests
const getAllReadingTests = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, testType, difficulty, isActive, searchTerm } = req.query;

        const filters = {
            testType: testType as string,
            difficulty: difficulty as string,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm as string,
        };

        const result = await ReadingService.getAllReadingTests(
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
            message: error instanceof Error ? error.message : "Failed to fetch reading tests",
        });
    }
};

// Get reading test by ID
const getReadingTestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const includeAnswers = req.query.includeAnswers === "true";

        const result = await ReadingService.getReadingTestById(id, includeAnswers);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Reading test not found",
        });
    }
};

// Get reading test for exam
const getReadingTestForExam = async (req: Request, res: Response) => {
    try {
        const { testNumber } = req.params;

        const result = await ReadingService.getReadingTestForExam(Number(testNumber));

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Reading test not found",
        });
    }
};

// Grade reading answers
const gradeReadingAnswers = async (req: Request, res: Response) => {
    try {
        const { testNumber, answers } = req.body;

        if (!testNumber || !answers) {
            return res.status(400).json({
                success: false,
                message: "testNumber and answers are required",
            });
        }

        const result = await ReadingService.gradeReadingAnswers(testNumber, answers);

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

// Update reading test
const updateReadingTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await ReadingService.updateReadingTest(id, req.body);

        res.json({
            success: true,
            message: "Reading test updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update reading test",
        });
    }
};

// Delete reading test
const deleteReadingTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await ReadingService.deleteReadingTest(id);

        res.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete reading test",
        });
    }
};

// Toggle active
const toggleActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await ReadingService.toggleActive(id);

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

// Get test summary
const getTestSummary = async (req: Request, res: Response) => {
    try {
        const { testType } = req.query;
        const result = await ReadingService.getTestSummary(testType as string);

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
        const result = await ReadingService.getStatistics();

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

export const ReadingController = {
    createReadingTest,
    getAllReadingTests,
    getReadingTestById,
    getReadingTestForExam,
    gradeReadingAnswers,
    updateReadingTest,
    deleteReadingTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
