import { Router } from 'express';
import authRoutes from './auth.routes.js';
import problemsRoutes from './problems.routes.js';
import submissionsRoutes from './submissions.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/problems', problemsRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/ai', aiRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AlgoPilot API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
