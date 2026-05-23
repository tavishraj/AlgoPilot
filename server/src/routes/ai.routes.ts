import { Router } from 'express';

const router = Router();

// ─── Future: AI-powered endpoints ────────────────────────
// POST /ai/hint       → Get AI hint for a problem
// POST /ai/explain    → Explain a solution
// POST /ai/review     → Code review
// POST /ai/generate   → Generate test cases

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'AI service placeholder' });
});

export default router;
