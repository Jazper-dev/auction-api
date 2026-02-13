import { Router } from "express";
import authRoutes from "./auth.route.js";
import productRoutes from "./product.route.js";
import uploadRoutes from "./upload.route.js";
import auctionRoutes from "./auctions.route.js";
import userRoutes from"./user.route.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/uploads", uploadRoutes);
router.use("/auctions", auctionRoutes);
router.use("/users",userRoutes);



export default router;
