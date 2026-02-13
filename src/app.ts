import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/swagger.js";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";
dotenv.config();

const app: Application = express();
const API_VERSION = process.env.VERSION;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(API_VERSION!, routes);
// Swagger generated
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Backend API " });
});
app.use(errorHandler);

export default app;
