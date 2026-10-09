import { createApp } from './app';
import { connectDB } from './config/db';
import { config } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize Express application
    const app = createApp();

    // 3. Listen on configured port
    const server = app.listen(config.port, () => {
      console.log('====================================================');
      console.log(` MPloyChek Employee Verification API running`);
      console.log(` Port: ${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` Local URL: http://localhost:${config.port}`);
      console.log(` Health Check: http://localhost:${config.port}/api/health`);
      console.log('====================================================');
    });

    // Graceful shutdown handling
    const shutdown = async () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
