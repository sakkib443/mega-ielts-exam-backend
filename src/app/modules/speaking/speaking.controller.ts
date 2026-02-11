import { Request, Response } from "express";
import { SpeakingService } from "./speaking.service";

// Create new speaking test
const createSpeakingTest = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user?.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await SpeakingService.createSpeakingTest(req.body, adminId);

        res.status(201).json({
            success: true,
            message: "Speaking test created successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create speaking test",
        });
    }
};

// Get all speaking tests
const getAllSpeakingTests = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, difficulty, isActive, searchTerm } = req.query;

        const filters = {
            difficulty: difficulty as string,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm as string,
        };

        const result = await SpeakingService.getAllSpeakingTests(
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
            message: error instanceof Error ? error.message : "Failed to fetch speaking tests",
        });
    }
};

// Get speaking test by ID
const getSpeakingTestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await SpeakingService.getSpeakingTestById(id);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Speaking test not found",
        });
    }
};

// Get speaking test for exam (public)
const getSpeakingTestForExam = async (req: Request, res: Response) => {
    try {
        const { testNumber } = req.params;

        const result = await SpeakingService.getSpeakingTestForExam(Number(testNumber));

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Speaking test not found",
        });
    }
};

// Update speaking test
const updateSpeakingTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await SpeakingService.updateSpeakingTest(id, req.body);

        res.json({
            success: true,
            message: "Speaking test updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update speaking test",
        });
    }
};

// Delete speaking test
const deleteSpeakingTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await SpeakingService.deleteSpeakingTest(id);

        res.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete speaking test",
        });
    }
};

// Toggle active status
const toggleActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await SpeakingService.toggleActive(id);

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
        const result = await SpeakingService.getTestSummary();

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
        const result = await SpeakingService.getStatistics();

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

export const SpeakingController = {
    createSpeakingTest,
    getAllSpeakingTests,
    getSpeakingTestById,
    getSpeakingTestForExam,
    updateSpeakingTest,
    deleteSpeakingTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
