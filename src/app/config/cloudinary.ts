import { v2 as cloudinary } from "cloudinary";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import config from "./index";

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

// Multer memory storage for handling file uploads
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max for audio files
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
        } else {
            cb(new Error("Invalid file type. Only audio and image files are allowed."));
        }
    },
});

// Upload to Cloudinary
export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string,
    resourceType: "image" | "video" | "raw" = "video" // audio uses "video" type
): Promise<{ url: string; publicId: string; duration?: number }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `ielts/${folder}`,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        duration: result.duration,
                    });
                }
            }
        );

        uploadStream.end(buffer);
    });
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (
    publicId: string,
    resourceType: "image" | "video" | "raw" = "video"
): Promise<void> => {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export default cloudinary;
