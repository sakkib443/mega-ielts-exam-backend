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
exports.QuestionSetController = void 0;
const questionSet_service_1 = require("./questionSet.service");
// Create new question set (Admin)
const createQuestionSet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = yield questionSet_service_1.QuestionSetService.createQuestionSet(req.body, adminId);
        res.status(201).json({
            success: true,
            message: "Question set created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create question set",
        });
    }
});
// Get all question sets (Admin)
const getAllQuestionSets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { setType, difficulty, isActive, searchTerm, page = "1", limit = "10", } = req.query;
        const filters = {
            setType: setType,
            difficulty: difficulty,
            isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            searchTerm: searchTerm,
        };
        const result = yield questionSet_service_1.QuestionSetService.getAllQuestionSets(filters, parseInt(page), parseInt(limit));
        res.status(200).json({
            success: true,
            message: "Question sets retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get question sets",
        });
    }
});
// Get question set by ID (Admin - with answers)
const getQuestionSetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const includeAnswers = req.query.includeAnswers === "true";
        const set = yield questionSet_service_1.QuestionSetService.getQuestionSetById(id, includeAnswers);
        res.status(200).json({
            success: true,
            message: "Question set retrieved successfully",
            data: set,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Question set not found",
        });
    }
});
// Get question set for exam (without answers)
const getQuestionSetForExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { setType, setNumber } = req.params;
        const set = yield questionSet_service_1.QuestionSetService.getQuestionSetForExam(setType, parseInt(setNumber));
        res.status(200).json({
            success: true,
            message: "Question set retrieved successfully",
            data: set,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Question set not found",
        });
    }
});
// Update question set (Admin)
const updateQuestionSet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield questionSet_service_1.QuestionSetService.updateQuestionSet(id, req.body);
        res.status(200).json({
            success: true,
            message: "Question set updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update question set",
        });
    }
});
// Delete question set (Admin)
const deleteQuestionSet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield questionSet_service_1.QuestionSetService.deleteQuestionSet(id);
        res.status(200).json({
            success: true,
            message: "Question set deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete question set",
        });
    }
});
// Toggle active status (Admin)
const toggleActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield questionSet_service_1.QuestionSetService.toggleActive(id);
        res.status(200).json({
            success: true,
            message: result.message,
            data: { isActive: result.isActive },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to toggle status",
        });
    }
});
// Get set summary for dropdown selection (Admin)
const getSetSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { setType } = req.params;
        const sets = yield questionSet_service_1.QuestionSetService.getSetSummary(setType);
        res.status(200).json({
            success: true,
            message: "Set summary retrieved successfully",
            data: sets,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get set summary",
        });
    }
});
// Get statistics (Admin)
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield questionSet_service_1.QuestionSetService.getStatistics();
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
exports.QuestionSetController = {
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
