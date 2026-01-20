import { Request, Response } from "express";
import { StudentService } from "./student.service";

// Create new student (Admin)
const createStudent = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user?.id;
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await StudentService.createStudent(req.body, adminId);

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create student",
        });
    }
};

// Get all students (Admin)
const getAllStudents = async (req: Request, res: Response) => {
    try {
        const {
            searchTerm,
            examStatus,
            paymentStatus,
            examDate,
            fromDate,
            toDate,
            page = "1",
            limit = "10",
        } = req.query;

        const filters = {
            searchTerm: searchTerm as string,
            examStatus: examStatus as any,
            paymentStatus: paymentStatus as any,
            examDate: examDate as string,
            fromDate: fromDate as string,
            toDate: toDate as string,
        };

        const result = await StudentService.getAllStudents(
            filters,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get students",
        });
    }
};

// Get student by ID
const getStudentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const student = await StudentService.getStudentById(id);

        res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || "Student not found",
        });
    }
};

// Get student by exam ID
const getStudentByExamId = async (req: Request, res: Response) => {
    try {
        const { examId } = req.params;
        const student = await StudentService.getStudentByExamId(examId);

        res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || "Student not found",
        });
    }
};

// Update student (Admin)
const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const student = await StudentService.updateStudent(id, req.body);

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update student",
        });
    }
};

// Delete student (Admin)
const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await StudentService.deleteStudent(id);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete student",
        });
    }
};

// Verify exam ID (Public - for exam entry)
const verifyExamId = async (req: Request, res: Response) => {
    try {
        const { examId } = req.body;
        const result = await StudentService.verifyExamId(examId);

        res.status(200).json({
            success: true,
            message: result.valid ? "Exam ID verified" : result.message,
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Verification failed",
        });
    }
};

// Start exam session
const startExam = async (req: Request, res: Response) => {
    try {
        const { examId, ipAddress, browserFingerprint } = req.body;
        const result = await StudentService.startExam(
            examId,
            ipAddress,
            browserFingerprint
        );

        res.status(200).json({
            success: true,
            message: "Exam started successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to start exam",
        });
    }
};

// Report violation
const reportViolation = async (req: Request, res: Response) => {
    try {
        const { examId, type } = req.body;
        const result = await StudentService.reportViolation(examId, type);

        res.status(200).json({
            success: true,
            message: "Violation reported",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to report violation",
        });
    }
};

// Complete exam and save scores
const completeExam = async (req: Request, res: Response) => {
    try {
        const { examId, scores } = req.body;
        const result = await StudentService.completeExam(examId, scores);

        res.status(200).json({
            success: true,
            message: "Exam completed successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to complete exam",
        });
    }
};

// Save individual module score
const saveModuleScore = async (req: Request, res: Response) => {
    try {
        const { examId, module, scoreData } = req.body;

        console.log("=== saveModuleScore Controller ===");
        console.log("examId:", examId);
        console.log("module:", module);
        console.log("scoreData:", JSON.stringify(scoreData, null, 2));
        console.log("scoreData.answers:", scoreData?.answers);

        if (!examId || !module || !scoreData) {
            return res.status(400).json({
                success: false,
                message: "examId, module, and scoreData are required",
            });
        }

        const result = await StudentService.saveModuleScore(examId, module, scoreData);

        res.status(200).json({
            success: true,
            message: `${module} exam score saved successfully`,
            data: result,
        });
    } catch (error: any) {
        console.error("saveModuleScore error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to save module score",
        });
    }
};

// Reset exam (Admin only)
const resetExam = async (req: Request, res: Response) => {
    try {
        const { examId } = req.params;
        const result = await StudentService.resetExam(examId);

        res.status(200).json({
            success: true,
            message: "Exam reset successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to reset exam",
        });
    }
};

// Get exam results
const getExamResults = async (req: Request, res: Response) => {
    try {
        const { examId } = req.params;
        const result = await StudentService.getExamResults(examId);

        res.status(200).json({
            success: true,
            message: "Results retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to get results",
        });
    }
};

// Get all results (Admin)
const getAllResults = async (req: Request, res: Response) => {
    try {
        const {
            searchTerm,
            examStatus,
            fromDate,
            toDate,
            page = "1",
            limit = "10",
        } = req.query;

        const filters = {
            searchTerm: searchTerm as string,
            examStatus: examStatus as any,
            fromDate: fromDate as string,
            toDate: toDate as string,
        };

        const result = await StudentService.getAllResults(
            filters,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.status(200).json({
            success: true,
            message: "Results retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get results",
        });
    }
};

// Get statistics (Admin dashboard)
const getStatistics = async (req: Request, res: Response) => {
    try {
        const stats = await StudentService.getStatistics();

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

// Update score for a module (Admin)
const updateScore = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { module, score } = req.body;

        if (!module || score === undefined) {
            return res.status(400).json({
                success: false,
                message: "module and score are required",
            });
        }

        const result = await StudentService.updateScore(id, module, score);

        res.status(200).json({
            success: true,
            message: "Score updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update score",
        });
    }
};

// Get answer sheet for a module (Admin)
const getAnswerSheet = async (req: Request, res: Response) => {
    try {
        const { id, module } = req.params;

        const result = await StudentService.getAnswerSheet(id, module);

        res.status(200).json({
            success: true,
            message: "Answer sheet retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to get answer sheet",
        });
    }
};

// Update all scores at once (Admin)
const updateAllScores = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { listening, reading, writing, adminRemarks } = req.body;

        const result = await StudentService.updateAllScores(id, {
            listening,
            reading,
            writing,
            adminRemarks,
        });

        res.status(200).json({
            success: true,
            message: "All scores updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update scores",
        });
    }
};

// Publish results for student (Admin)
const publishResults = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { publish = true } = req.body;

        const result = await StudentService.publishResults(id, publish);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to publish results",
        });
    }
};

// Reset individual module (admin only)
const resetModule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { module } = req.body;

        if (!module || !["listening", "reading", "writing"].includes(module)) {
            return res.status(400).json({
                success: false,
                message: "Valid module name is required (listening, reading, or writing)",
            });
        }

        const result = await StudentService.resetModule(id, module);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to reset module",
        });
    }
};

export const StudentController = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentByExamId,
    updateStudent,
    deleteStudent,
    verifyExamId,
    startExam,
    reportViolation,
    completeExam,
    saveModuleScore,
    resetExam,
    getExamResults,
    getAllResults,
    getStatistics,
    updateScore,
    getAnswerSheet,
    updateAllScores,
    publishResults,
    resetModule,
};
