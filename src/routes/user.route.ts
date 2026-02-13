import { Router } from "express";
import * as walletController from "../controllers/wallet.controller.js";
import * as orderController from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);
router.get("/wallet",walletController.getMyWallet);
router.post("/wallet/top-up", walletController.topUpMyWallet);
router.get("/orders", orderController.getMyOrders);

export default router;