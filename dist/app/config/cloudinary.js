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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const index_1 = __importDefault(require("./index"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: index_1.default.cloudinary_cloud_name,
    api_key: index_1.default.cloudinary_api_key,
    api_secret: index_1.default.cloudinary_api_secret,
});
// Multer memory storage for handling file uploads
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max for audio files
    },
    fileFilter: (req, file, cb) => {
        // Allow audio and image files
        const allowedMimes = [
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/ogg",
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only audio and image files are allowed."));
        }
    },
});
// Upload to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "video" // audio uses "video" type
) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `ielts/${folder}`,
            resource_type: resourceType,
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    duration: result.duration,
                });
            }
        });
        uploadStream.end(buffer);
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
// Delete from Cloudinary
const deleteFromCloudinary = (publicId, resourceType = "video") => __awaiter(void 0, void 0, void 0, function* () {
    yield cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType });
});
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = cloudinary_1.v2;
