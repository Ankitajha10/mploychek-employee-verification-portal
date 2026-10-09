import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config/env';

export const createApp = (): Application => {
  const app: Application = express();

  // Middleware
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:4200', 'http://127.0.0.1:4200'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api', apiRouter);

  // 404 Route Handler
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Resource not found: ${req.method} ${req.originalUrl}`
    });
  });

  // Centralized Global Error Handler
  app.use(errorHandler);

  return app;
};
