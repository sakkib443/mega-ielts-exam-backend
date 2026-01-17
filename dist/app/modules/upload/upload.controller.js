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
exports.UploadController = void 0;
const cloudinary_1 = require("../../config/cloudinary");
// Upload audio file
const uploadAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No audio file provided",
            });
        }
        const result = yield (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "audio", "video" // Cloudinary uses "video" type for audio
        );
        res.status(200).json({
            success: true,
            message: "Audio uploaded successfully",
            data: {
                url: result.url,
                publicId: result.publicId,
                duration: result.duration,
                filename: req.file.originalname,
                size: req.file.size,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload audio",
        });
    }
});
// Upload image file
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided",
            });
        }
        const result = yield (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "images", "image");
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                url: result.url,
                publicId: result.publicId,
                filename: req.file.originalname,
                size: req.file.size,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload image",
        });
    }
});
// Delete file
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicId } = req.params;
        const resourceType = req.query.type || "video";
        yield (0, cloudinary_1.deleteFromCloudinary)(publicId, resourceType);
        res.status(200).json({
            success: true,
            message: "File deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete file",
        });
    }
});
exports.UploadController = {
    uploadAudio,
    uploadImage,
    deleteFile,
};
