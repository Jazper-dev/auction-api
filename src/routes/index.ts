import { Router } from "express";
import authRoutes from "./auth.route.js";
import productRoutes from "./product.route.js";
import uploadRoutes from "./upload.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/uploads", uploadRoutes);



export default router;
