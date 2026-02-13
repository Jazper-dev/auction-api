import { registry } from "./registry.js";
export const registerUserAssetsDocs = () => {
  const TAG = "User Assets";

  // --- [GET] Wallet Info ---
  registry.registerPath({
    method: "get",
    path: "/users/wallet",
    tags: [TAG],
    summary: "Get current user's wallet balance and transactions",
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: "Wallet data fetched successfully" },
      401: { description: "Unauthorized" },
    },
  });

  // --- [POST] Top-up Wallet ---
  registry.registerPath({
    method: "post",
    path: "/users/wallet/top-up",
    tags: [TAG],
    summary: "Mock top-up user balance",
    security: [{ bearerAuth: [] }],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              amount: { type: "number", example: 1000 },
            },
            required: ["amount"],
          },
        },
      },
    },
    responses: { 200: { description: "Top-up successful" } },
  });

  // --- [GET] My Orders ---
  registry.registerPath({
    method: "get",
    path: "/users/orders",
    tags: [TAG],
    summary: "Get list of auctions won by user",
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: "Orders fetched successfully" },
    },
  });
};
