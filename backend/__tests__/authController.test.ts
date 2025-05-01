import { AuthController } from '../src/controllers/authController';
import { RefreshTokenModel } from '../src/models/refreshTokenModel';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/refreshTokenModel');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    process.env.STATIC_USER_EMAIL = 'test@example.com';
    process.env.STATIC_USER_PASSWORD = 'password';
    process.env.JWT_SECRET = 'kedVpf3TBduN';
    process.env.JWT_REFRESH_SECRET = 'refresh_secret';
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');
      (RefreshTokenModel.create as jest.Mock).mockResolvedValue({ token: 'refresh_token', userId: 1 });

      await AuthController.login(req as Request, res as Response);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'access_token', refreshToken: 'refresh_token' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'kedVpf3TBduN', { expiresIn: '1h' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'refresh_secret', { expiresIn: '7d' });
      expect(RefreshTokenModel.create).toHaveBeenCalledWith('refresh_token', 1);
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { email: 'wrong@example.com', password: 'wrong' };

      await AuthController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Identifiants invalides' });
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(RefreshTokenModel.create).not.toHaveBeenCalled();
    });

    it('should return 500 on server error', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error('Server error');
      });

      await AuthController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    });
  });

  describe('refresh', () => {
    it('should return new access token for valid refresh token', async () => {
      req.body = { refreshToken: 'valid_refresh_token' };
      (RefreshTokenModel.findByToken as jest.Mock).mockResolvedValue({ token: 'valid_refresh_token', userId: 1 });
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });
      (jwt.sign as jest.Mock).mockReturnValue('new_access_token');

      await AuthController.refresh(req as Request, res as Response);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'new_access_token' });
      expect(jwt.verify).toHaveBeenCalledWith('valid_refresh_token', 'refresh_secret');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'kedVpf3TBduN', { expiresIn: '1h' });
    });

    it('should return 400 if refresh token is missing', async () => {
      req.body = {};

      await AuthController.refresh(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Refresh token requis' });
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should return 401 if refresh token is invalid', async () => {
      req.body = { refreshToken: 'invalid_refresh_token' };
      (RefreshTokenModel.findByToken as jest.Mock).mockResolvedValue(null);

      await AuthController.refresh(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Refresh token invalide ou expiré' });
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should return 401 on token verification error', async () => {
      req.body = { refreshToken: 'valid_refresh_token' };
      (RefreshTokenModel.findByToken as jest.Mock).mockResolvedValue({ token: 'valid_refresh_token', userId: 1 });
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await AuthController.refresh(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Refresh token invalide' });
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});