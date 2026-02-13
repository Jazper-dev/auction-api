import prisma from "../libs/prisma.js";

export const getUserOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { buyerId: userId },
    include: { 
      product: {
        select: { title: true, media: true }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });
};