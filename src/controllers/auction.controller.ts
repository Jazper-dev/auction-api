import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response.util.js";
import * as auctionService from "../services/auction.service.js";

export const endAuction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.params.productId);
  const io = req.app.get("io");

  const result = await auctionService.closeAuction(productId, io);

  return successResponse(res, result.data, result.message);
};
