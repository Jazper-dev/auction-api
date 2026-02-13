import prisma from "../libs/prisma.js";

export const getWalletData = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      balance: true,
      frozenBalance: true,
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });
};

export const topUpWallet = async (userId: number, amount: number) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: amount } }
  });
};