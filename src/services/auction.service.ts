import { Server } from "socket.io";
import prisma from "../libs/prisma.js";
import { AppError } from "../utils/appError.js";


export const closeAuction = async (productId: number,io?: Server) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      include: {
        bids: {
          orderBy: { amount: "desc" },
          take: 1,
        },
      },
    });

    if (!product) throw new AppError("Product not found", 404);
    if (product.status !== "active") throw new AppError("Auction already ended", 400);

    const winnerBid = product.bids[0];

 
    if (!winnerBid) {
      await tx.product.update({
        where: { id: productId },
        data: { status: "ended" }, 
      });
      return { message: "Auction ended with no bids." };
    }


    const finalPrice = winnerBid.amount;
    const depositPaid = product.startPrice * 0.1; 
    const remainingAmount = finalPrice - depositPaid; 

    const order = await tx.order.create({
      data: {
        orderNo: `ORD-${Date.now()}-${productId}`,
        productId: productId,
        buyerId: winnerBid.userId,
        sellerId: product.sellerId,
        amount: finalPrice,
        depositPaid: depositPaid,
        remainingPaid: remainingAmount,
        status: "pending", 
        shippingAddress: "To be provided by buyer",
      },
    });


    await tx.product.update({
      where: { id: productId },
      data: { status: "pending_payment" },
    });

    // 💡 ตรงนี้พี่อาจจะเพิ่มการพ่น Socket บอกคนชนะด้วยก็ได้ครับ
    if (io) {
      // ตะโกนบอกทุกคนที่ดูสินค้าชิ้นนี้อยู่
      io.emit(`auction_ended_${productId}`, {
        status: "pending_payment",
        winnerId: winnerBid.userId,
        finalPrice: finalPrice,
        orderId: order.id,
        message: "Auction closed! We have a winner."
      });

      // (Optional) ตะโกนบอกเฉพาะคนชนะ (ถ้าพี่ใช้ระบบ Room หรือ Private Msg)
      io.to(`user_${winnerBid.userId}`).emit("notification", {
        type: "AUCTION_WIN",
        message: `ยินดีด้วยครับ! คุณชนะการประมูล ${product.title}`,
        orderId: order.id
      });
    }
    
    return {
      message: "Auction closed successfully. Order created.",
      data: order,
    };
  });
};