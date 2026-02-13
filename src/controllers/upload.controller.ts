import { Request, Response } from "express";
import { successResponse } from "../utils/response.util.js";
import * as uploadService from "../services/upload.service.js";
import { AppError } from "../utils/appError.js";

export const uploadFile = async (req: Request, res: Response) => {
 
  const file = req.file as Express.Multer.File;

  if (!file) {
    throw new AppError("Please upload a file", 400);
  }

   const bucketName = file.mimetype.startsWith("video") ? "videos" : "images";

  const fileUrl = await uploadService.uploadToMinio(
    bucketName,
    file.originalname,
    file.buffer,
    file.size,
    file.mimetype
  );

  return successResponse(res, { url: fileUrl }, "File uploaded successfully");
};


