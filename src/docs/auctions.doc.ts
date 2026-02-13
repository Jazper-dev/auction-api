import { registry } from "./registry.js";
export const registerUserDocs = () => {
const TAG = "Auctions";

// --- [POST] Place a Bid ---
registry.registerPath({
  method: "post",
  path: "/auctions/{id}/bid",
  tags: [TAG],
  summary: "Place a bid on a product",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
      description: "Product ID",
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            amount: { type: "number", example: 1200 },
          },
          required: ["amount"],
        },
      },
    },
  },
  responses: { 
    200: { description: "Bid placed successfully" },
    400: { description: "Invalid bid amount or auction ended" },
    401: { description: "Unauthorized" }
  },
});

// --- [POST] End Auction ---
registry.registerPath({
  method: "post",
  path: "/auctions/{id}/end",
  tags: [TAG],
  summary: "End an auction and create an order",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
      description: "Product ID",
    },
  ],
  responses: { 
    200: { description: "Auction ended and order created successfully" },
    404: { description: "Product not found" }
  },
});
};