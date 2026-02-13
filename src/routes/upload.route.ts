import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadVideo,uploadImage } from "../middlewares/multer.middleware.js";
import * as uploadController from "../controllers/upload.controller.js";

const router = Router();

router.use(authenticate); 

router.post("/image", uploadImage, uploadController.uploadFile);
router.post("/video", uploadVideo, uploadController.uploadFile);

export default router;