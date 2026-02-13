import prisma from "../libs/prisma.js";
import { AppError } from "../utils/appError.js"; 

export const getHighestBidder = async (productId: number) => {
  const highestBid = await prisma.bid.findFirst({
    where: { productId },
    orderBy: { amount: "desc" },
    include: { user: { select: { id: true, username: true } } }
  });
  return highestBid;
};

export const placeBid = async (userId: number, productId: number, amount: number) => {
  return await prisma.$transaction(async (tx) => {

    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new AppError("Product not found in the system", 404);
    if (product.status !== "active") throw new AppError("This auction is no longer active", 400);

    const now = new Date();
    if (product.endTime && now > product.endTime) throw new AppError("The auction has already ended", 400);
    if (product.sellerId === userId) throw new AppError("You cannot bid on your own product", 400);


    const minBidAmount = product.currentPrice > 0 ? product.currentPrice : product.startPrice;
    if (amount <= minBidAmount) {
      throw new AppError(`Bid amount must be higher than ${minBidAmount}`, 400);
    }


    const previousHighestBid = await tx.bid.findFirst({
      where: { productId },
      orderBy: { amount: "desc" },
    });


    if (previousHighestBid && previousHighestBid.userId !== userId) {
      const refundAmount = product.startPrice * 0.1; 

      await tx.user.update({
        where: { id: previousHighestBid.userId },
        data: {
          balance: { increment: refundAmount },
          frozenBalance: { decrement: refundAmount }
        }
      });

      await tx.walletTransaction.create({
        data: {
          userId: previousHighestBid.userId,
          amount: refundAmount,
          type: "unfreeze",
          status: "success",
          productId: productId,
 
        }
      });
    }

    const existingBid = await tx.bid.findFirst({
      where: { userId, productId }
    });

    if (!existingBid) {
      const depositAmount = product.startPrice * 0.1; 
      const user = await tx.user.findUnique({ where: { id: userId } });
      
      if (!user) throw new AppError("User not found", 404);
      if (user.balance < depositAmount) {
        throw new AppError(`Insufficient balance for 10% deposit (Requires ${depositAmount} THB)`, 400);
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: depositAmount },
          frozenBalance: { increment: depositAmount }
        }
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          amount: depositAmount,
          type: "freeze",
          status: "success",
          productId: productId,
        }
      });
    }


    const newBid = await tx.bid.create({
      data: {
        amount: amount,
        userId: userId,
        productId: productId
      }
    });

    await tx.product.update({
      where: { id: productId },
      data: { currentPrice: amount }
    });

    return newBid;
  });
};