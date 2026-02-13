import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);
export const createProductSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    startingPrice: z.number().positive("Starting price must be greater than 0"),
    bidStep: z.number().min(1, "Bid step must be at least 1"),
    endAt: z.string().datetime("Invalid date format (ISO 8601)"),
    images: z.array(z.string().url()).min(1, "At least one image is required"),
    video: z.string().url().optional(),
    categoryId: z.number().int().positive("Category ID is required"),
  })
  .openapi("CreateProduct");

export const updateProductSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    bidStep: z.number().min(1).optional(),
    endAt: z.string().datetime().optional(),
    images: z.array(z.string().url()).optional(),
    video: z.string().url().optional(),
  })
  .openapi("UpdateProduct");

export const productResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    currentPrice: z.number(),
    startingPrice: z.number(),
    status: z.enum(["ACTIVE", "ENDED", "CANCELLED"]),
    sellerId: z.number(),
    createdAt: z.date(),
    _count: z.object({
      bids: z.number(),
    }).optional(),
  })
  .openapi("ProductResponse");