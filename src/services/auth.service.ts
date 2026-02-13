import prisma from "../libs/prisma.js";
import { v4 as uuidv4 } from "uuid";
import { comparePassword, hashPassword } from "../utils/hash.util.js";
import { sendResetPasswordEmail, sendVerifyEmail } from "../utils/mail.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";
import { AppError } from "../utils/appError.js";
import crypto from "crypto"
interface TokenPayload {
  id: number;
  role: string;
  sessionId: string;
}

export const registerUser = async (userData: any) => {
  const verifyToken = uuidv4();
  const hashedPassword = await hashPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      verifyToken,
      isVerified: false,
      balance: 1000,
    },
  });

  sendVerifyEmail(user.email, verifyToken).catch(console.error);

  return {
    message: "Registration successful. Please check your email to verify.",
    data: user,
  };
};

export const loginUser = async (loginData: any) => {
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
  });

  if (!user) throw new AppError("Credentials invalid.", 401);

  const isMatch = await comparePassword(loginData.password, user.password);
  if (!isMatch) throw new AppError("Credentials invalid.", 401);

  if (!user.isVerified)
    throw new AppError("Account not verified. Please check your email.", 403);

  await prisma.session.deleteMany({
    where: { userId: user.id },
  });
 const temp = crypto.randomBytes(20).toString('hex');
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: temp,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    sessionId: session.id,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
    sessionId: session.id,
  });

  const hashedRefreshToken = await hashPassword(refreshToken);

  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: loginData.deviceInfo || "Unknown Device",
    },
  });

  return {
    message: "Login successful.",
    data: {
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance,
      },
      sessionId: session.id,
      accessToken,
      refreshToken,
    },
  };
};

export const logOutUser = async (sessionId: string) => {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new AppError("Session not found.", 404);

  await prisma.session.delete({
    where: { id: sessionId },
  });

  return { message: "Logout successful." };
};

export const logOutAllDevices = async (userId: string) => {
  await prisma.session.deleteMany({
    where: { userId: Number(userId) },
  });

  return { message: "Logout from all devices successful." };
};

export const verifyEmailToken = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) throw new AppError("Invalid or expired token", 400);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verifyToken: null,
    },
  });

  return { message: "Email verified successfully. You can now login." };
};

export const resendVerification = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);
  if (user.isVerified)
    throw new AppError("This email has already been verified", 400);

  const newToken = uuidv4();

  await prisma.user.update({
    where: { id: user.id },
    data: { verifyToken: newToken },
  });

  await sendVerifyEmail(user.email, newToken);
  return { message: "Verification email has been resent successfully." };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);

  const resetToken = uuidv4();
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  await sendResetPasswordEmail(user.email, resetToken);
  return { message: "Password reset email sent successfully." };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  });

  if (!user) throw new AppError("Invalid or expired reset token", 400);

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: "Password has been reset successfully." };
};

export const refreshAccessToken = async (oldRefreshToken: string) => {
  const payload = verifyRefreshToken(
    oldRefreshToken,
  ) as unknown as TokenPayload;

  if (!payload || !payload.sessionId) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const oldSession = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  });

  if (!oldSession) {
    throw new AppError("Session not found. Please login again.", 401);
  }

  const isTokenMatch = await comparePassword(
    oldRefreshToken,
    oldSession.refreshToken,
  );

  if (!isTokenMatch) {
    await prisma.session.deleteMany({ where: { userId: oldSession.userId } });
    throw new AppError(
      "Security alert: Token reuse detected. All sessions revoked.",
      401,
    );
  }

  await prisma.session.delete({ where: { id: oldSession.id } });

  const newSession = await prisma.session.create({
    data: {
      userId: oldSession.userId,
      refreshToken: "PENDING",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: oldSession.deviceInfo,
    },
  });

  const newAccessToken = generateAccessToken({
    id: oldSession.user.id,
    role: oldSession.user.role,
    sessionId: newSession.id,
  });

  const newRefreshToken = generateRefreshToken({
    id: oldSession.user.id,
    role: oldSession.user.role,
    sessionId: newSession.id,
  });

  const hashedNewRefreshToken = await hashPassword(newRefreshToken);
  await prisma.session.update({
    where: { id: newSession.id },
    data: { refreshToken: hashedNewRefreshToken },
  });

  return {
    message: "Token refreshed successfully",
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
};
