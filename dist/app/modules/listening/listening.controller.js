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
exports.ListeningController = void 0;
const listening_service_1 = require("./listening.service");
// Create new listening test
const createListeningTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = yield listening_service_1.ListeningService.createListeningTest(req.body, adminId);
        res.status(201).json({
            success: true,
            message: "Listening test created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create listening test",
        });
    }
});
// Get all listening tests
const getAllListeningTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, difficulty, isActive, searchTerm } = req.query;
        const filters = {
            difficulty: difficulty,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm,
        };
        const result = yield listening_service_1.ListeningService.getAllListeningTests(filters, Number(page), Number(limit));
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch listening tests",
        });
    }
});
// Get listening test by ID
const getListeningTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const includeAnswers = req.query.includeAnswers === "true";
        const result = yield listening_service_1.ListeningService.getListeningTestById(id, includeAnswers);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Listening test not found",
        });
    }
});
// Get listening test for exam (public - no answers)
const getListeningTestForExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testNumber } = req.params;
        const result = yield listening_service_1.ListeningService.getListeningTestForExam(Number(testNumber));
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Listening test not found",
        });
    }
});
// Grade listening answers
const gradeListeningAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testNumber, answers } = req.body;
        if (!testNumber || !answers) {
            return res.status(400).json({
                success: false,
                message: "testNumber and answers are required",
            });
        }
        const result = yield listening_service_1.ListeningService.gradeListeningAnswers(testNumber, answers);
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
// Update listening test
const updateListeningTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield listening_service_1.ListeningService.updateListeningTest(id, req.body);
        res.json({
            success: true,
            message: "Listening test updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update listening test",
        });
    }
});
// Delete listening test
const deleteListeningTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield listening_service_1.ListeningService.deleteListeningTest(id);
        res.json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete listening test",
        });
    }
});
// Toggle active status
const toggleActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield listening_service_1.ListeningService.toggleActive(id);
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
// Get test summary for dropdown
const getTestSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield listening_service_1.ListeningService.getTestSummary();
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
        const result = yield listening_service_1.ListeningService.getStatistics();
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
exports.ListeningController = {
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
