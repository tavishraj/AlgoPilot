import { Router } from 'express';
import { problemsController } from '../controllers/problems.controller.js';

const router = Router();

router.get('/', problemsController.getAll);
router.get('/:slug', problemsController.getBySlug);
router.post('/', problemsController.create);
router.put('/:id', problemsController.update);
router.delete('/:id', problemsController.delete);

export default router;
