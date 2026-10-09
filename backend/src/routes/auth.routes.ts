import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncDelayMiddleware } from '../middleware/delay.middleware';

const router = Router();

// Apply async delay middleware so login requests can also demonstrate loading states if desired
router.use(asyncDelayMiddleware);

// Public login route
router.post('/login', AuthController.login);

// Protected current user profile route
router.get('/me', authenticateJWT, AuthController.getMe);

export default router;
