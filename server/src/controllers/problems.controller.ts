import { Request, Response, NextFunction } from 'express';
import { problemsService } from '../services/problems.service.js';
import { Difficulty } from '@prisma/client';

export const problemsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const difficulty = req.query.difficulty as string | undefined;
      const tags = req.query.tags as string | undefined;
      const search = req.query.search as string | undefined;
      const page = req.query.page as string | undefined;
      const limit = req.query.limit as string | undefined;

      const result = await problemsService.getAll({
        difficulty: difficulty as Difficulty | undefined,
        tags: tags ? tags.split(',') : undefined,
        search,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const problem = await problemsService.getBySlug(req.params.slug as string);

      if (!problem) {
        res.status(404).json({ success: false, error: 'Problem not found' });
        return;
      }

      res.json({ success: true, data: problem });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const problem = await problemsService.create(req.body);
      res.status(201).json({ success: true, data: problem });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const problem = await problemsService.update(req.params.id as string, req.body);
      res.json({ success: true, data: problem });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await problemsService.delete(req.params.id as string);
      res.json({ success: true, message: 'Problem deleted' });
    } catch (error) {
      next(error);
    }
  },
};
