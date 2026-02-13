import multer from "multer";
import { AppError } from "../utils/appError.js";

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new AppError("Please upload only image files", 400) as any, false);
  }
}).single("image"); 

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video")) cb(null, true);
    else cb(new AppError("Please upload only video files", 400) as any, false);
  }
}).single("video"); 