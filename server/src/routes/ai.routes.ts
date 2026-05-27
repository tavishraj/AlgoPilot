// ─── AI-DOST Routes ──────────────────────────────────────
// All AI-DOST endpoints with validation middleware.
// Mounted at /api/ai in the route index.

import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import {
  validateHintRequest,
  validateExplainRequest,
  validateDebugRequest,
  validateConceptRequest,
} from '../middleware/ai.validators.js';

const router = Router();

// ─── Legacy AI Endpoints ─────────────────────────────────

router.post('/hint', validateHintRequest, aiController.postHint);
router.post('/explain', validateExplainRequest, aiController.postExplain);
router.post('/debug', validateDebugRequest, aiController.postDebug);
router.post('/concept', validateConceptRequest, aiController.postConcept);

// ─── Contextual Orchestration Endpoints ──────────────────

router.post('/contextual-hint', validateHintRequest, aiController.postContextualHint);

// ─── Health Check ────────────────────────────────────────

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AI-DOST service is running',
    version: '2.0.0',
    features: ['progressive-hints', 'contextual-orchestration', 'code-analysis'],
    timestamp: new Date().toISOString(),
  });
});

export default router;