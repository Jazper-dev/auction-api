import { createProductSchema, updateProductSchema } from "../schemas/product.schema.js";
import { registry } from "./registry.js";

export const registerProductDocs = () => {
  const TAG = "Products";

  // 1. Get All Products (Public)
  registry.registerPath({
    method: "get",
    path: "/products",
    tags: [TAG],
    summary: "Get all active auction products", 
    parameters: [
      { name: "page", in: "query", schema: { type: "integer", default: 1 } },
      { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
    ],
    responses: { 200: { description: "Fetch all products success" } },
  });

  // 2. Get Product By ID (Public)
  registry.registerPath({
    method: "get",
    path: "/products/{id}",
    tags: [TAG],
    summary: "Get product details by ID", 
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: { 200: { description: "Product details fetched" } },
  });

  // --- PROTECTED ROUTES ---

  // 3. My Auctions
  registry.registerPath({
    method: "get",
    path: "/products/my/auctions",
    tags: [TAG],
    summary: "Get list of products I am selling", 
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: "page", in: "query", schema: { type: "integer", default: 1 } },
      { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
    ],
    responses: { 200: { description: "Your selling list" } },
  });

  // 4. My Bids
  registry.registerPath({
    method: "get",
    path: "/products/my/bids",
    tags: [TAG],
    summary: "Get my bidding history", 
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: "Your bidding history" } },
  });

  // 5. Create Product
  registry.registerPath({
    method: "post",
    path: "/products",
    tags: [TAG],
    summary: "Create a new auction product", 
    security: [{ bearerAuth: [] }],
    request: {
      body: { content: { "application/json": { schema: createProductSchema } } },
    },
    responses: { 201: { description: "Product created successfully" } },
  });

  // 6. Update Product
  registry.registerPath({
    method: "patch",
    path: "/products/{id}",
    tags: [TAG],
    summary: "Update product details", 
    security: [{ bearerAuth: [] }],
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    request: {
      body: { content: { "application/json": { schema: updateProductSchema } } },
    },
    responses: { 200: { description: "Product updated" } },
  });

  // 7. Delete Product
  registry.registerPath({
    method: "delete",
    path: "/products/{id}",
    tags: [TAG],
    summary: "Delete or cancel an auction product", 
    security: [{ bearerAuth: [] }],
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: { 200: { description: "Product deleted/cancelled" } },
  });
};