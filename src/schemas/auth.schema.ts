
import { z } from "../libs/zod-openapi.js";

export const registerSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .openapi("Register");

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .openapi("Login");
export const forgotPasswordSchema = z
  .object({
    email: z.string().email("Invalid email format"),
  })
  .openapi("ForgotPassword");

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  })
  .openapi("ResetPassword");