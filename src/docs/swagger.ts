// src/docs/swagger.ts
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.js";
import { registerAuthDocs } from "./auth.doc.js";
import { registerProductDocs } from "./product.doc.js";
import { registerUploadDocs } from "./upload.doc.js";

registerAuthDocs();
registerProductDocs();
registerUploadDocs();


const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Auction API",
    version: "1.0.0",
  },
  servers: [{ url: "/api/v1" },{ url: "/api/v2" }],
  
});
