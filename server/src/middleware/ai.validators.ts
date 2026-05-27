// ─── AI Request Validation Middleware ─────────────────────
// Validates and sanitizes AI-DOST request bodies before
// they reach the controller. Uses the existing validate() pattern.

import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler.js';
import type { SupportedLanguage } from '../types/ai.types.js';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'javascript', 'typescript', 'python', 'java', 'cpp',
];

const VALID_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

// ─── Shared Context Validator ────────────────────────────

/**
 * Validates the common `context` object present in all AI requests.
 * Returns an array of error messages (empty = valid).
 */
function validateContext(context: unknown): string[] {
  const errors: string[] = [];

  if (!context || typeof context !== 'object') {
    return ['Missing required field: context'];
  }

  const ctx = context as Record<string, unknown>;

  if (!ctx.problemTitle || typeof ctx.problemTitle !== 'string') {
    errors.push('context.problemTitle is required and must be a string');
  }

  if (!ctx.difficulty || !VALID_DIFFICULTIES.includes(ctx.difficulty as string)) {
    errors.push(`context.difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }

  if (!ctx.description || typeof ctx.description !== 'string') {
    errors.push('context.description is required and must be a string');
  }

  if (typeof ctx.userCode !== 'string') {
    errors.push('context.userCode is required and must be a string');
  }

  if (!ctx.language || !SUPPORTED_LANGUAGES.includes(ctx.language as SupportedLanguage)) {
    errors.push(`context.language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  // Optional: validate testResults if present
  if (ctx.testResults !== undefined && !Array.isArray(ctx.testResults)) {
    errors.push('context.testResults must be an array if provided');
  }

  return errors;
}

// ─── Endpoint-Specific Validators ────────────────────────

/**
 * Validates POST /ai/hint requests.
 * Requires context + hintLevel (1-3).
 */
export function validateHintRequest(req: Request, _res: Response, next: NextFunction): void {
  const errors = validateContext(req.body?.context);

  const hintLevel = req.body?.hintLevel;
  if (hintLevel === undefined || ![1, 2, 3, 4].includes(hintLevel)) {
    errors.push('hintLevel is required and must be 1, 2, 3, or 4');
  }

  if (errors.length > 0) {
    return next(createError(errors.join('; '), 400));
  }
  next();
}

/**
 * Validates POST /ai/explain requests.
 * Requires context with non-empty userCode.
 */
export function validateExplainRequest(req: Request, _res: Response, next: NextFunction): void {
  const errors = validateContext(req.body?.context);

  if (req.body?.context?.userCode !== undefined && req.body.context.userCode.trim().length === 0) {
    errors.push('context.userCode must not be empty for code explanation');
  }

  if (errors.length > 0) {
    return next(createError(errors.join('; '), 400));
  }
  next();
}

/**
 * Validates POST /ai/debug requests.
 * Requires context + testResults with at least one failing test.
 */
export function validateDebugRequest(req: Request, _res: Response, next: NextFunction): void {
  const errors = validateContext(req.body?.context);

  const testResults = req.body?.testResults;
  if (!testResults || !Array.isArray(testResults) || testResults.length === 0) {
    errors.push('testResults is required and must be a non-empty array');
  } else {
    const hasFailing = testResults.some((t: { passed?: boolean }) => t.passed === false);
    if (!hasFailing) {
      errors.push('testResults must contain at least one failing test for debugging');
    }
  }

  if (errors.length > 0) {
    return next(createError(errors.join('; '), 400));
  }
  next();
}

/**
 * Validates POST /ai/concept requests.
 * Requires context. concept field is optional.
 */
export function validateConceptRequest(req: Request, _res: Response, next: NextFunction): void {
  const errors = validateContext(req.body?.context);

  if (req.body?.concept !== undefined && typeof req.body.concept !== 'string') {
    errors.push('concept must be a string if provided');
  }

  if (errors.length > 0) {
    return next(createError(errors.join('; '), 400));
  }
  next();
}
