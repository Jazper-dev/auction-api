import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './docs/swagger.js';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware.js';
import routes from "./routes/index.js";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(errorHandler);
app.use("/api/V1/", routes);
// Swagger Auto-generated
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Backend API ' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    });
});

export default app;