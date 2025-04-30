import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/refreshTokenModel';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const staticUser = {
        id: 1,
        email: process.env.STATIC_USER_EMAIL ,
        password: process.env.STATIC_USER_PASSWORD ,
      };

      if (email !== staticUser.email || password !== staticUser.password) {
        res.status(401).json({ error: 'Identifiants invalides' });
        return;
      }

      const accessToken = jwt.sign({ userId: staticUser.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
      });

      const refreshToken = jwt.sign(
        { userId: staticUser.id },
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        { expiresIn: '7d' }
      );

      await RefreshTokenModel.create(refreshToken, staticUser.id);

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token requis' });
        return;
      }

      const storedToken = await RefreshTokenModel.findByToken(refreshToken);
      if (!storedToken) {
        res.status(401).json({ error: 'Refresh token invalide ou expiré' });
        return;
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret'
      ) as { userId: number };

      const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
      });

      res.json({ accessToken });
    } catch (error) {
      res.status(401).json({ error: 'Refresh token invalide' });
    }
  }
}