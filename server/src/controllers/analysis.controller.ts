// ─── Analysis Controller ─────────────────────────────────
// Standalone static analysis endpoint (no AI required).
// Exposes the deterministic analysis engine via HTTP.

import { Request, Response, NextFunction } from 'express';
import { analyzeCodeStatic } from '../analysis/index.js';
import type { SupportedLanguage } from '../types/ai.types.js';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'javascript', 'typescript', 'python', 'java', 'cpp',
];

export const analysisController = {
  /**
   * POST /analysis/analyze
   * Runs full static analysis on the provided code.
   * Returns a StaticAnalysisReport.
   */
  async postAnalyze(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language } = req.body;

      // Validation
      if (!code || typeof code !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Missing or invalid "code" field (string required).',
        });
        return;
      }

      if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
        res.status(400).json({
          success: false,
          error: `Missing or invalid "language" field. Must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
        });
        return;
      }

      // Limit code size (prevent abuse)
      if (code.length > 50_000) {
        res.status(400).json({
          success: false,
          error: 'Code exceeds maximum allowed length (50,000 characters).',
        });
        return;
      }

      const report = analyzeCodeStatic(code, language);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /analysis/health
   * Health check for the analysis service.
   */
  async getHealth(_req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Static Analysis Engine is running',
      version: '1.0.0',
      supportedLanguages: SUPPORTED_LANGUAGES,
      capabilities: [
        'time-complexity-estimation',
        'space-complexity-estimation',
        'nested-loop-detection',
        'recursion-detection',
        'beginner-mistake-detection',
        'edge-case-detection',
        'infinite-loop-detection',
        'unreachable-code-detection',
        'pattern-recognition',
        'code-quality-suggestions',
      ],
      timestamp: new Date().toISOString(),
    });
  },
};
