// ─── AI-DOST Controller ──────────────────────────────────
// Handles HTTP request/response for all AI endpoints.
// Delegates business logic to aiService. Follows the
// existing controller pattern (try/catch → next(error)).
// Extended with contextual hint endpoint.

import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';
import type {
  AiHintRequest,
  AiExplainRequest,
  AiDebugRequest,
  AiConceptRequest,
} from '../types/ai.types.js';

export const aiController = {
  /**
   * POST /ai/hint
   * Progressive hint generation (levels 1-4).
   */
  async postHint(req: Request, res: Response, next: NextFunction) {
    try {
      const { context, hintLevel } = req.body as AiHintRequest;
      const result = await aiService.getHint({ context, hintLevel });

      const statusCode = result.success ? 200 : 502;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /ai/explain
   * Code explanation with difficulty-adapted depth.
   */
  async postExplain(req: Request, res: Response, next: NextFunction) {
    try {
      const { context } = req.body as AiExplainRequest;
      const result = await aiService.explainCode({ context });

      const statusCode = result.success ? 200 : 502;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /ai/debug
   * Debugging assistance based on failing tests.
   */
  async postDebug(req: Request, res: Response, next: NextFunction) {
    try {
      const { context, testResults } = req.body as AiDebugRequest;
      const result = await aiService.debugCode({ context, testResults });

      const statusCode = result.success ? 200 : 502;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /ai/concept
   * DSA concept teaching with analogies.
   */
  async postConcept(req: Request, res: Response, next: NextFunction) {
    try {
      const { context, concept } = req.body as AiConceptRequest;
      const result = await aiService.explainConcept({ context, concept });

      const statusCode = result.success ? 200 : 502;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  },

  // ─── Contextual Orchestration Endpoint ───────────────────

  /**
   * POST /ai/contextual-hint
   * Enriched hint generation via the context orchestration pipeline.
   * Runs code analysis → context assembly → prompt orchestration.
   * Produces higher-quality, context-aware responses.
   */
  async postContextualHint(req: Request, res: Response, next: NextFunction) {
    try {
      const { context, hintLevel } = req.body as AiHintRequest;
      const result = await aiService.getContextualHint({ context, hintLevel });

      const statusCode = result.success ? 200 : 502;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  },
};
