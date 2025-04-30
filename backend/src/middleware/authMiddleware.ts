import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}