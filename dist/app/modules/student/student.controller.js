"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student_service_1 = require("./student.service");
// Create new student (Admin)
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = yield student_service_1.StudentService.createStudent(req.body, adminId);
        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create student",
        });
    }
});
// Get all students (Admin)
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm, examStatus, paymentStatus, examDate, fromDate, toDate, page = "1", limit = "10", } = req.query;
        const filters = {
            searchTerm: searchTerm,
            examStatus: examStatus,
            paymentStatus: paymentStatus,
            examDate: examDate,
            fromDate: fromDate,
            toDate: toDate,
        };
        const result = yield student_service_1.StudentService.getAllStudents(filters, parseInt(page), parseInt(limit));
        res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get students",
        });
    }
});
// Get student by ID
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield student_service_1.StudentService.getStudentById(id);
        res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Student not found",
        });
    }
});
// Get student by exam ID
const getStudentByExamId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId } = req.params;
        const student = yield student_service_1.StudentService.getStudentByExamId(examId);
        res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Student not found",
        });
    }
});
// Update student (Admin)
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield student_service_1.StudentService.updateStudent(id, req.body);
        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update student",
        });
    }
});
// Delete student (Admin)
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield student_service_1.StudentService.deleteStudent(id);
        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete student",
        });
    }
});
// Verify exam ID (Public - for exam entry)
const verifyExamId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId } = req.body;
        const result = yield student_service_1.StudentService.verifyExamId(examId);
        res.status(200).json({
            success: true,
            message: result.valid ? "Exam ID verified" : result.message,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Verification failed",
        });
    }
});
// Start exam session
const startExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId, ipAddress, browserFingerprint } = req.body;
        const result = yield student_service_1.StudentService.startExam(examId, ipAddress, browserFingerprint);
        res.status(200).json({
            success: true,
            message: "Exam started successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to start exam",
        });
    }
});
// Report violation
const reportViolation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId, type } = req.body;
        const result = yield student_service_1.StudentService.reportViolation(examId, type);
        res.status(200).json({
            success: true,
            message: "Violation reported",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to report violation",
        });
    }
});
// Complete exam and save scores
const completeExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId, scores } = req.body;
        const result = yield student_service_1.StudentService.completeExam(examId, scores);
        res.status(200).json({
            success: true,
            message: "Exam completed successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to complete exam",
        });
    }
});
// Save individual module score
const saveModuleScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId, module, scoreData } = req.body;
        if (!examId || !module || !scoreData) {
            return res.status(400).json({
                success: false,
                message: "examId, module, and scoreData are required",
            });
        }
        const result = yield student_service_1.StudentService.saveModuleScore(examId, module, scoreData);
        res.status(200).json({
            success: true,
            message: `${module} exam score saved successfully`,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to save module score",
        });
    }
});
// Reset exam (Admin only)
const resetExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId } = req.params;
        const result = yield student_service_1.StudentService.resetExam(examId);
        res.status(200).json({
            success: true,
            message: "Exam reset successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to reset exam",
        });
    }
});
// Get exam results
const getExamResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { examId } = req.params;
        const result = yield student_service_1.StudentService.getExamResults(examId);
        res.status(200).json({
            success: true,
            message: "Results retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to get results",
        });
    }
});
// Get all results (Admin)
const getAllResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm, examStatus, fromDate, toDate, page = "1", limit = "10", } = req.query;
        const filters = {
            searchTerm: searchTerm,
            examStatus: examStatus,
            fromDate: fromDate,
            toDate: toDate,
        };
        const result = yield student_service_1.StudentService.getAllResults(filters, parseInt(page), parseInt(limit));
        res.status(200).json({
            success: true,
            message: "Results retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get results",
        });
    }
});
// Get statistics (Admin dashboard)
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield student_service_1.StudentService.getStatistics();
        res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get statistics",
        });
    }
});
exports.StudentController = {
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
};
