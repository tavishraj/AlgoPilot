import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';

// NOTE: In production, use bcrypt for password hashing and jsonwebtoken for JWT
// This is a scaffold — actual crypto will be added during auth integration

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password } = req.body;

      // Check if user already exists
      const existingEmail = await authService.findByEmail(email);
      if (existingEmail) {
        res.status(409).json({ success: false, error: 'Email already in use' });
        return;
      }

      const existingUsername = await authService.findByUsername(username);
      if (existingUsername) {
        res.status(409).json({ success: false, error: 'Username already taken' });
        return;
      }

      // TODO: Hash password with bcrypt
      const passwordHash = password; // placeholder

      const user = await authService.register({ email, username, passwordHash });

      // TODO: Generate JWT token
      const token = 'placeholder-jwt-token';

      res.status(201).json({
        success: true,
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await authService.findByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      // TODO: Compare password with bcrypt
      const isValid = password === user.passwordHash; // placeholder
      if (!isValid) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      // TODO: Generate JWT token
      const token = 'placeholder-jwt-token';

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Get user ID from JWT token
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const user = await authService.findById(userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
};
