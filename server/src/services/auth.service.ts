import { prisma } from '../lib/prisma.js';

export const authService = {
  async register(data: {
    email: string;
    username: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        role: true,
        rank: true,
        streak: true,
        solvedCount: true,
        rating: true,
        createdAt: true,
      },
    });
  },

  async createSession(userId: string, token: string, expiresAt: Date) {
    return prisma.session.create({
      data: { userId, token, expiresAt },
    });
  },

  async deleteSession(token: string) {
    return prisma.session.delete({
      where: { token },
    });
  },
};
