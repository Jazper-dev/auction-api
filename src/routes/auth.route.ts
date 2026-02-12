import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from "../schemas/auth.schema.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// ==========================================
//  PUBLIC ROUTES
// ==========================================

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/verify-email", authController.verifyEmail); //  GET จาก Link
router.post("/resend-verification", authController.resendVerification);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// ==========================================
//  PROTECTED ROUTES
// ==========================================

router.use(authenticate); 

router.post("/logout", authController.logout);
router.post("/logout-all", authController.logoutAll);
router.post("/refresh-token", authController.refreshAccessToken);


router.use(router);

export default router;