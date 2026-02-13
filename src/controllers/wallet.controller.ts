import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response.util.js";
import * as walletService from "../services/wallet.service.js";

export const getMyWallet = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const data = await walletService.getWalletData(userId);
  return successResponse(res, data, "Wallet data fetched successfully.");
};

export const topUpMyWallet = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount } = req.body;
  const data = await walletService.topUpWallet(userId, amount);
  return successResponse(res, data, "Wallet topped up successfully.");
};
