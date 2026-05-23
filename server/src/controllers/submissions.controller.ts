import { Request, Response, NextFunction } from 'express';
import { submissionsService } from '../services/submissions.service.js';

export const submissionsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Get userId from authenticated request
      const userId = (req as any).user?.id || 'anonymous';
      const { problemId, code, language } = req.body;

      const submission = await submissionsService.create({
        userId,
        problemId,
        code,
        language,
      });

      // TODO: Send to code execution queue
      // For now, just return the created submission
      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  },

  async getByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await submissionsService.getByUser(userId, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const submission = await submissionsService.getById(req.params.id as string);

      if (!submission) {
        res.status(404).json({ success: false, error: 'Submission not found' });
        return;
      }

      res.json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  },
};
