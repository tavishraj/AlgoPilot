import { Router } from 'express';
import { submissionsController } from '../controllers/submissions.controller.js';

const router = Router();

router.post('/', submissionsController.create);
router.get('/user/:userId', submissionsController.getByUser);
router.get('/:id', submissionsController.getById);

export default router;
