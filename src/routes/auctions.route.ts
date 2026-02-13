import { Router } from "express";
import * as bidController from "../controllers/bids.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate); 
router.post("/:id/bid", bidController.placeBid);
router.post("/:id/end", bidController.endAuction);


export default router; 