import { prisma } from '../lib/prisma.js';
import { SubmissionStatus } from '@prisma/client';

export const submissionsService = {
  async create(data: {
    userId: string;
    problemId: string;
    code: string;
    language: string;
  }) {
    return prisma.submission.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  },

  async updateStatus(
    id: string,
    status: SubmissionStatus,
    result?: { runtime?: number; memory?: number; output?: string }
  ) {
    return prisma.submission.update({
      where: { id },
      data: {
        status,
        ...result,
      },
    });
  },

  async getByUser(userId: string, page = 1, limit = 20) {
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          problem: {
            select: { title: true, slug: true, difficulty: true },
          },
        },
      }),
      prisma.submission.count({ where: { userId } }),
    ]);

    return {
      data: submissions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getByProblem(problemId: string, userId?: string) {
    const where: any = { problemId };
    if (userId) where.userId = userId;

    return prisma.submission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async getById(id: string) {
    return prisma.submission.findUnique({
      where: { id },
      include: {
        problem: { select: { title: true, slug: true } },
        user: { select: { username: true, avatarUrl: true } },
      },
    });
  },
};
