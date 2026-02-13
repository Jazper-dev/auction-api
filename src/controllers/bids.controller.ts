import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response.util.js";
import * as bidsService from "../services/bids.service.js";
import { AppError } from "../utils/appError.js";

export const placeBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.params.id);
  const { amount } = req.body;
  const userId = (req as any).user.id;

  if (!amount) {
    throw new AppError("Bid amount is required", 400);
  }

  const bidResult = await bidsService.placeBid(userId, productId, amount);

  const io = req.app.get("io");
  if (io) {
    io.emit(`product_update_${productId}`, {
      productId,
      newPrice: bidResult.amount,
      bidderId: userId,
      message: "New bid placed!",
    });
  }

  return successResponse(
    res,
    bidResult,
    "Bid placed successfully and deposit locked.",
  );
};
export function endAuction(arg0: string, endAuction: any) {
    throw new Error("Function not implemented.");
}

