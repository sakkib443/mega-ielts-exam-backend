import { Request, Response } from "express";
import { WritingService } from "./writing.service";

// Create new writing test
const createWritingTest = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user?.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await WritingService.createWritingTest(req.body, adminId);

        res.status(201).json({
            success: true,
            message: "Writing test created successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create writing test",
        });
    }
};

// Get all writing tests
const getAllWritingTests = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, testType, difficulty, topicCategory, isActive, searchTerm } = req.query;

        const filters = {
            testType: testType as string,
            difficulty: difficulty as string,
            topicCategory: topicCategory as string,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm as string,
        };

        const result = await WritingService.getAllWritingTests(
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
            message: error instanceof Error ? error.message : "Failed to fetch writing tests",
        });
    }
};

// Get writing test by ID
const getWritingTestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const includeSamples = req.query.includeSamples === "true";

        const result = await WritingService.getWritingTestById(id, includeSamples);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Writing test not found",
        });
    }
};

// Get writing test for exam
const getWritingTestForExam = async (req: Request, res: Response) => {
    try {
        const { testNumber } = req.params;

        const result = await WritingService.getWritingTestForExam(Number(testNumber));

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Writing test not found",
        });
    }
};

// Submit writing response
const submitWritingResponse = async (req: Request, res: Response) => {
    try {
        const { studentId, testNumber, taskNumber, response } = req.body;

        if (!studentId || !testNumber || !taskNumber || !response) {
            return res.status(400).json({
                success: false,
                message: "studentId, testNumber, taskNumber, and response are required",
            });
        }

        const result = await WritingService.submitWritingResponse(
            studentId,
            testNumber,
            taskNumber,
            response
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to submit response",
        });
    }
};

// Mark writing submission
const markWritingSubmission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const examinerId = (req as any).user?.id;
        const { scores, feedback } = req.body;

        if (!examinerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!scores || !feedback) {
            return res.status(400).json({
                success: false,
                message: "scores and feedback are required",
            });
        }

        const result = await WritingService.markWritingSubmission(
            id,
            examinerId,
            scores,
            feedback
        );

        res.json({
            success: true,
            message: "Submission marked successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to mark submission",
        });
    }
};

// Get pending submissions
const getPendingSubmissions = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const result = await WritingService.getPendingSubmissions(
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
            message: error instanceof Error ? error.message : "Failed to fetch submissions",
        });
    }
};

// Update writing test
const updateWritingTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await WritingService.updateWritingTest(id, req.body);

        res.json({
            success: true,
            message: "Writing test updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update writing test",
        });
    }
};

// Delete writing test
const deleteWritingTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await WritingService.deleteWritingTest(id);

        res.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete writing test",
        });
    }
};

// Toggle active
const toggleActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await WritingService.toggleActive(id);

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
        const result = await WritingService.getTestSummary(testType as string);

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
        const result = await WritingService.getStatistics();

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

export const WritingController = {
    createWritingTest,
    getAllWritingTests,
    getWritingTestById,
    getWritingTestForExam,
    submitWritingResponse,
    markWritingSubmission,
    getPendingSubmissions,
    updateWritingTest,
    deleteWritingTest,
    toggleActive,
    getTestSummary,
    getStatistics,
};
