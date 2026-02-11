import { Router } from "express";
import { UploadController } from "./upload.controller";
import { upload } from "../../config/cloudinary";
import { auth, authorize } from "../../middlewares/auth";

const router = Router();

// ============ PUBLIC ROUTES (For exam) ============
// Upload speaking recording (public - students upload during exam)
router.post("/speaking-recording", upload.single("video"), UploadController.uploadVideo);

// ============ ADMIN ROUTES ============
// All routes below require admin authentication
router.use(auth);
router.use(authorize("admin"));

// Upload single audio file
router.post("/audio", upload.single("audio"), UploadController.uploadAudio);

// Upload single image file
router.post("/image", upload.single("image"), UploadController.uploadImage);

// Delete file
router.delete("/:publicId", UploadController.deleteFile);

export const UploadRoutes = router;
