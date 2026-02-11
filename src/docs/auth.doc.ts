import { registry } from "./registry.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.js";

export const registerAuthDocs = () => {
  // 1. Register
  registry.registerPath({
    method: "post",
    path: "/auth/register",
    tags: ["Authentication"],
    request: {
      body: { content: { "application/json": { schema: registerSchema } } },
    },
    responses: { 201: { description: "User created" } },
  });

  // 2. Login
  registry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Authentication"],
    request: {
      body: { content: { "application/json": { schema: loginSchema } } },
    },
    responses: { 200: { description: "Login success" } },
  });

  // 3. Verify Email
  registry.registerPath({
    method: "get",
    path: "/auth/verify-email",
    tags: ["Authentication"],
    parameters: [
      {
        name: "token",
        in: "query",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: { 200: { description: "Email verified" } },
  });

  // 4. Resend Verification
  registry.registerPath({
    method: "post",
    path: "/auth/resend-verification",
    tags: ["Authentication"],
    request: {
      body: {
        content: { "application/json": { schema: forgotPasswordSchema } },
      }, // ใช้ email schema เดียวกัน
    },
    responses: { 200: { description: "Verification email resent" } },
  });

  // 5. Forgot Password
  registry.registerPath({
    method: "post",
    path: "/auth/forgot-password",
    tags: ["Authentication"],
    request: {
      body: {
        content: { "application/json": { schema: forgotPasswordSchema } },
      },
    },
    responses: { 200: { description: "Password reset email sent" } },
  });

  // 6. Reset Password
  registry.registerPath({
    method: "post",
    path: "/auth/reset-password",
    tags: ["Authentication"],
    request: {
      body: {
        content: { "application/json": { schema: resetPasswordSchema } },
      },
    },
    responses: { 200: { description: "Password has been reset" } },
  });

  // 7. Logout (Protected)
  registry.registerPath({
    method: "post",
    path: "/auth/logout",
    tags: ["Authentication"],

    security: [{ bearerAuth: [] }], // ใส่แม่กุญแจใน Swagger
    responses: { 200: { description: "Logout success" } },
  });

  // 8. Logout All Devices (Protected)
  registry.registerPath({
    method: "post",
    path: "/auth/logout-all",
    tags: ["Authentication"],
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: "Logged out from all devices" } },
  });

  // 9. Refresh Access Token (Protected)
  registry.registerPath({
    method: "post",
    path: "/auth/refresh-token",
    tags: ["Authentication"],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              refreshToken: {
                type: "string",
              },
            },
            required: ["refreshToken"],
          },
        },
      },
    },
    responses: { 200: { description: "Refresh Access Token" } },
  });
};
