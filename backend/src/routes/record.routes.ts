import { Router } from 'express';
import { RecordController } from '../controllers/record.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncDelayMiddleware } from '../middleware/delay.middleware';

const router = Router();

// Apply async delay middleware so GET /api/records?delay=2000 delays asynchronously
router.use(asyncDelayMiddleware);

// All record routes require authentication
router.use(authenticateJWT);

router.get('/', RecordController.getRecords);
router.get('/:id', RecordController.getRecordById);
router.post('/', RecordController.createRecord);
router.put('/:id', RecordController.updateRecord);

export default router;
