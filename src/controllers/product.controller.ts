import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service.js";
import { successResponse } from "../utils/response.util.js";

export const getProducts = async (req: Request, res: Response) => {
  const { data, message } = await productService.getProducts();
  return successResponse(res, data, message);
};

export const getProductById = async (req: Request, res: Response) => {
  const { data, message } = await productService.getProductById(
    Number(req.params.id),
  );
  return successResponse(res, data, message);
};

export const getMyAuctions = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { data, meta, message } = await productService.getMyAuctions(
    userId,
    page,
    limit,
  );
  return successResponse(res, { products: data, meta }, message);
};

export const getMyBids = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { data, meta, message } = await productService.getMyBids(
    userId,
    page,
    limit,
  );
  return successResponse(res, { bids: data, meta }, message);
};

export const createProduct = async (req: Request, res: Response) => {
  const { message } = await productService.createProduct(req.user.id, req.body);
  return successResponse(res, null, message);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const { message } = await productService.deleteProduct(
    req.user.id,
    productId,
  );
  return successResponse(res, null, message);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { productId, ...updateData } = req.body;
  const { message } = await productService.updateProduct(
    req.user.id,
    productId,
    updateData,
  );
  return successResponse(res, null, message);
};
