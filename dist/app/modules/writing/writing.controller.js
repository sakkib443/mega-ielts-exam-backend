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
exports.WritingController = void 0;
const writing_service_1 = require("./writing.service");
// Create new writing test
const createWritingTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = yield writing_service_1.WritingService.createWritingTest(req.body, adminId);
        res.status(201).json({
            success: true,
            message: "Writing test created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create writing test",
        });
    }
});
// Get all writing tests
const getAllWritingTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, testType, difficulty, topicCategory, isActive, searchTerm } = req.query;
        const filters = {
            testType: testType,
            difficulty: difficulty,
            topicCategory: topicCategory,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm,
        };
        const result = yield writing_service_1.WritingService.getAllWritingTests(filters, Number(page), Number(limit));
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch writing tests",
        });
    }
});
// Get writing test by ID
const getWritingTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const includeSamples = req.query.includeSamples === "true";
        const result = yield writing_service_1.WritingService.getWritingTestById(id, includeSamples);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Writing test not found",
        });
    }
});
// Get writing test for exam
const getWritingTestForExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testNumber } = req.params;
        const result = yield writing_service_1.WritingService.getWritingTestForExam(Number(testNumber));
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Writing test not found",
        });
    }
});
// Submit writing response
const submitWritingResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, testNumber, taskNumber, response } = req.body;
        if (!studentId || !testNumber || !taskNumber || !response) {
            return res.status(400).json({
                success: false,
                message: "studentId, testNumber, taskNumber, and response are required",
            });
        }
        const result = yield writing_service_1.WritingService.submitWritingResponse(studentId, testNumber, taskNumber, response);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to submit response",
        });
    }
});
// Mark writing submission
const markWritingSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        const examinerId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
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
        const result = yield writing_service_1.WritingService.markWritingSubmission(id, examinerId, scores, feedback);
        res.json({
            success: true,
            message: "Submission marked successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to mark submission",
        });
    }
});
// Get pending submissions
const getPendingSubmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = yield writing_service_1.WritingService.getPendingSubmissions(Number(page), Number(limit));
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch submissions",
        });
    }
});
// Update writing test
const updateWritingTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield writing_service_1.WritingService.updateWritingTest(id, req.body);
        res.json({
            success: true,
            message: "Writing test updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update writing test",
        });
    }
});
// Delete writing test
const deleteWritingTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield writing_service_1.WritingService.deleteWritingTest(id);
        res.json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete writing test",
        });
    }
});
// Toggle active
const toggleActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield writing_service_1.WritingService.toggleActive(id);
        res.json({
            success: true,
            message: result.message,
            data: { isActive: result.isActive },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to toggle status",
        });
    }
});
// Get test summary
const getTestSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testType } = req.query;
        const result = yield writing_service_1.WritingService.getTestSummary(testType);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch summary",
        });
    }
});
// Get statistics
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield writing_service_1.WritingService.getStatistics();
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch statistics",
        });
    }
});
exports.WritingController = {
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
