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
exports.ReadingController = void 0;
const reading_service_1 = require("./reading.service");
// Create new reading test
const createReadingTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = yield reading_service_1.ReadingService.createReadingTest(req.body, adminId);
        res.status(201).json({
            success: true,
            message: "Reading test created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create reading test",
        });
    }
});
// Get all reading tests
const getAllReadingTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, testType, difficulty, isActive, searchTerm } = req.query;
        const filters = {
            testType: testType,
            difficulty: difficulty,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm,
        };
        const result = yield reading_service_1.ReadingService.getAllReadingTests(filters, Number(page), Number(limit));
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch reading tests",
        });
    }
});
// Get reading test by ID
const getReadingTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const includeAnswers = req.query.includeAnswers === "true";
        const result = yield reading_service_1.ReadingService.getReadingTestById(id, includeAnswers);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Reading test not found",
        });
    }
});
// Get reading test for exam
const getReadingTestForExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testNumber } = req.params;
        const result = yield reading_service_1.ReadingService.getReadingTestForExam(Number(testNumber));
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Reading test not found",
        });
    }
});
// Grade reading answers
const gradeReadingAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testNumber, answers } = req.body;
        if (!testNumber || !answers) {
            return res.status(400).json({
                success: false,
                message: "testNumber and answers are required",
            });
        }
        const result = yield reading_service_1.ReadingService.gradeReadingAnswers(testNumber, answers);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to grade answers",
        });
    }
});
// Update reading test
const updateReadingTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield reading_service_1.ReadingService.updateReadingTest(id, req.body);
        res.json({
            success: true,
            message: "Reading test updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update reading test",
        });
    }
});
// Delete reading test
const deleteReadingTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield reading_service_1.ReadingService.deleteReadingTest(id);
        res.json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete reading test",
        });
    }
});
// Toggle active
const toggleActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield reading_service_1.ReadingService.toggleActive(id);
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
        const result = yield reading_service_1.ReadingService.getTestSummary(testType);
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
        const result = yield reading_service_1.ReadingService.getStatistics();
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
exports.ReadingController = {
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
