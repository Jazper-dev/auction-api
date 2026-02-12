import prisma from "../libs/prisma.js";
import { AppError } from "../utils/appError.js";
import { getCache, setCache } from "../utils/redis.util.js";

export const getProducts = async () => {
  const cacheKey = "all_products";
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return { data: cachedData, message: "Products fetched from cache" };
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  if (products) {
    await setCache(cacheKey, products, 60);
  }
  if (!products || products.length === 0) {
    throw new AppError("No products found", 404);
  }

  return { data: products, message: "Products fetched from database" };
};

export const getProductById = async (productId: number) => {
  const cacheKey = `product_${productId}`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return { data: cachedData, message: "Product fetched from cache" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (product) {
    await setCache(cacheKey, product, 60);
  }

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return { data: product, message: "Product fetched from database" };
};

export const getMyAuctions = async (
  userId: number,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const myAuctions = await prisma.product.findMany({
    where: {
      sellerId: userId,
    },
    skip: skip,
    take: limit,
    include: {
      _count: {
        select: { bids: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (myAuctions.length === 0) {
    throw new AppError("You have no auction items.", 404);
  }
  const totalItems = await prisma.product.count({
    where: { sellerId: userId },
  });

  return {
    data: myAuctions,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
    message: "Fetched your auctions with pagination",
  };
};

export const getMyBids = async (
  userId: number,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const myBids = await prisma.bid.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: true,
    },
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
  if (myBids.length === 0) {
    throw new AppError("You have no bids.", 404);
  }

  const totalItems = await prisma.bid.count({
    where: { userId: userId },
  });

  return {
    data: myBids,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
    message: "Fetched your bids with pagination",
  };
};

export const createProduct = async (userId: number, productData: any) => {
  const newProduct = await prisma.product.create({
    data: {
      ...productData,
      sellerId: userId,
    },
  });
  return { data: newProduct, message: "Product created successfully" };
};
export const deleteProduct = async (userId: number, productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  if (product.sellerId !== userId) {
    throw new AppError("You are not authorized to delete this product", 403);
  }
  await prisma.product.delete({
    where: { id: productId },
  });
  return { message: "Product deleted successfully" };
};
export const updateProduct = async (
  userId: number,
  productId: number,
  updateData: any,
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  if (product.sellerId !== userId) {
    throw new AppError("You are not authorized to update this product", 403);
  }
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: updateData,
  });
  return { data: updatedProduct, message: "Product updated successfully" };
};
