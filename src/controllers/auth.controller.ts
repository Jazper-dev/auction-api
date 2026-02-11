import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { successResponse } from "../utils/response.util.js";


export const login = async (req: Request, res: Response) => {
  const { data, message } = await authService.loginUser(req.body);
  return successResponse(res, data, message);
};

export const register = async (req: Request, res: Response) => {
  const { data, message } = await authService.registerUser(req.body);
  return successResponse(res, data, message);
};

export const logout = async (req: Request, res: Response) => {
  const { message } = await authService.logOutUser(req.sessionId!);
  return successResponse(res, null, message);
};

export const logoutAll = async (req: Request, res: Response) => {
  const { message } = await authService.logOutAllDevices(req.user.id);
  return successResponse(res, null, message);
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  const { message } = await authService.verifyEmailToken(token as string);
  return successResponse(res, null, message);
};
export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  const { message } = await authService.resendVerification(email);
  return successResponse(res, null, message);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const { message } = await authService.forgotPassword(email);
  return successResponse(res, null, message);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  const { message } = await authService.resetPassword(token, newPassword);
  return successResponse(res, null, message);
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const { data,message } = await authService.refreshAccessToken(refreshToken);
  return successResponse(res, data, message);
};