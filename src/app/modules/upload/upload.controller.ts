import { Request, Response } from "express";
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary";

// Upload audio file
const uploadAudio = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No audio file provided",
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "audio",
            "video" // Cloudinary uses "video" type for audio
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload audio",
        });
    }
};

// Upload image file
const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided",
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "images",
            "image"
        );

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload image",
        });
    }
};

// Delete file
const deleteFile = async (req: Request, res: Response) => {
    try {
        const { publicId } = req.params;
        const resourceType = (req.query.type as "image" | "video") || "video";

        await deleteFromCloudinary(publicId, resourceType);

        res.status(200).json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete file",
        });
    }
};

export const UploadController = {
    uploadAudio,
    uploadImage,
    deleteFile,
};
