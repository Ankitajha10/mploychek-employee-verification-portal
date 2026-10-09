import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { asyncDelayMiddleware } from '../middleware/delay.middleware';

const router = Router();

// Apply async delay middleware
router.use(asyncDelayMiddleware);

// All user management routes require valid JWT authentication and ADMIN role
router.use(authenticateJWT);
router.use(requireRole('ADMIN'));

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.patch('/:id/status', UserController.toggleStatus);
router.delete('/:id', UserController.deleteUser);

export default router;
