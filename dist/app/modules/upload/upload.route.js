"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = require("express");
const upload_controller_1 = require("./upload.controller");
const cloudinary_1 = require("../../config/cloudinary");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// All upload routes require admin authentication
router.use(auth_1.auth);
router.use((0, auth_1.authorize)("admin"));
// Upload single audio file
router.post("/audio", cloudinary_1.upload.single("audio"), upload_controller_1.UploadController.uploadAudio);
// Upload single image file
router.post("/image", cloudinary_1.upload.single("image"), upload_controller_1.UploadController.uploadImage);
// Delete file
router.delete("/:publicId", upload_controller_1.UploadController.deleteFile);
exports.UploadRoutes = router;
