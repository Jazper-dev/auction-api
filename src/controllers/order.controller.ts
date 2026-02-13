import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response.util.js";
import * as orderService from "../services/order.service.js";

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as any).user.id;
  const data = await orderService.getUserOrders(userId);
  return successResponse(res, data, "Orders fetched successfully.");
};
