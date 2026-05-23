import { prisma } from '../lib/prisma.js';
import { Difficulty } from '@prisma/client';

export interface ProblemFilters {
  difficulty?: Difficulty;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export const problemsService = {
  async getAll(filters: ProblemFilters = {}) {
    const { difficulty, tags, search, page = 1, limit = 20 } = filters;

    const where: any = {};

    if (difficulty) where.difficulty = difficulty;
    if (tags && tags.length > 0) where.tags = { hasSome: tags };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          tags: true,
          acceptanceRate: true,
          totalAttempts: true,
          createdAt: true,
        },
      }),
      prisma.problem.count({ where }),
    ]);

    return {
      data: problems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getBySlug(slug: string) {
    return prisma.problem.findUnique({
      where: { slug },
      include: {
        _count: { select: { submissions: true } },
      },
    });
  },

  async create(data: {
    title: string;
    slug: string;
    description: string;
    difficulty: Difficulty;
    tags: string[];
    constraints?: string;
    examples: any;
    starterCode: any;
    testCases: any;
  }) {
    return prisma.problem.create({ data });
  },

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    difficulty: Difficulty;
    tags: string[];
    constraints: string;
    examples: any;
    starterCode: any;
    testCases: any;
  }>) {
    return prisma.problem.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.problem.delete({ where: { id } });
  },
};
