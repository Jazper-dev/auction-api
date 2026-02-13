import { registry } from "./registry.js";
import { z } from "zod";

export const registerUploadDocs = () => {
  const TAG = "Uploads";

  registry.registerPath({
    method: "post",
    path: "/uploads/image",
    tags: [TAG],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                image: { 
                  type: "string",
                  format: "binary",
                  description: "ไฟล์รูปภาพ (jpg, png) ขนาดไม่เกิน 5MB",
                },
              },
              required: ["image"],
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "อัปโหลดรูปภาพสำเร็จ",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              data: z.object({ url: z.string().url() }),
              message: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/uploads/video",
    tags: [TAG],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                video: { 
                  type: "string",
                  format: "binary",
                  description: "ไฟล์วิดีโอ (mp4, mov) ขนาดไม่เกิน 50MB",
                },
              },
              required: ["video"],
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "อัปโหลดวิดีโอสำเร็จ",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              data: z.object({ url: z.string().url() }),
              message: z.string(),
            }),
          },
        },
      },
    },
  });
};