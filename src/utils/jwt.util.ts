import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: object) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is missing in .env");

  return jwt.sign(payload, secret, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: object) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is missing in .env");

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is missing in .env");
  return jwt.verify(token, secret!);
};

export const verifyRefreshToken = (token: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is missing in .env");

  return jwt.verify(token, secret!);
};
