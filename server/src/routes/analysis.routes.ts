// ─── Analysis Routes ─────────────────────────────────────
// Static analysis endpoints — no AI, no LLM, pure heuristics.
// Mounted at /api/analysis in the route index.

import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller.js';

const router = Router();

router.post('/analyze', analysisController.postAnalyze);
router.get('/health', analysisController.getHealth);

export default router;
