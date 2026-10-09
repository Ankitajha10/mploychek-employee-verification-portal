import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import recordRoutes from './record.routes';
import statsRoutes from './stats.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/records', recordRoutes);
apiRouter.use('/stats', statsRoutes);

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'MPloyChek Employee Verification API'
  });
});

export default apiRouter;
