import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// ==========================================
//  PUBLIC ROUTES
// ==========================================

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// ==========================================
//  PROTECTED ROUTES
// ==========================================

router.use(authenticate); 

router.get("/my/auctions", productController.getMyAuctions); 
router.get("/my/bids", productController.getMyBids);         
router.post("/", productController.createProduct);           
router.patch("/:id", productController.updateProduct);       
router.delete("/:id", productController.deleteProduct);     

export default router;