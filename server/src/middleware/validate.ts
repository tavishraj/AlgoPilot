import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler.js';

type ValidationSchema = {
  body?: Record<string, (value: unknown) => boolean>;
  params?: Record<string, (value: unknown) => boolean>;
  query?: Record<string, (value: unknown) => boolean>;
};

/**
 * Lightweight request validation middleware.
 * For production, replace with zod or joi.
 */
export function validate(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    if (schema.body) {
      for (const [key, validator] of Object.entries(schema.body)) {
        if (!validator(req.body?.[key])) {
          errors.push(`Invalid or missing field: body.${key}`);
        }
      }
    }

    if (schema.params) {
      for (const [key, validator] of Object.entries(schema.params)) {
        if (!validator(req.params?.[key])) {
          errors.push(`Invalid or missing field: params.${key}`);
        }
      }
    }

    if (schema.query) {
      for (const [key, validator] of Object.entries(schema.query)) {
        if (!validator(req.query?.[key])) {
          errors.push(`Invalid or missing field: query.${key}`);
        }
      }
    }

    if (errors.length > 0) {
      return next(createError(errors.join('; '), 400));
    }

    next();
  };
}

// ─── Common Validators ──────────────────────────────────

export const isString = (v: unknown): boolean => typeof v === 'string' && v.length > 0;
export const isEmail = (v: unknown): boolean =>
  typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isOptionalString = (v: unknown): boolean =>
  v === undefined || v === null || typeof v === 'string';
