import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { asyncDelayMiddleware } from '../middleware/delay.middleware';

const router = Router();

// Apply async delay middleware
router.use(asyncDelayMiddleware);

// Admin only
router.use(authenticateJWT);
router.use(requireRole('ADMIN'));

router.get('/', StatsController.getStats);

export default router;
