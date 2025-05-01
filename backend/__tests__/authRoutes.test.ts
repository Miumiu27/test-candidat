import request from 'supertest';
import app from '../src/app';
import { RefreshTokenModel } from '../src/models/refreshTokenModel';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/refreshTokenModel');
jest.mock('jsonwebtoken');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STATIC_USER_EMAIL = 'test@example.com';
    process.env.STATIC_USER_PASSWORD = 'password';
    process.env.JWT_SECRET = 'kedVpf3TBduN';
    process.env.JWT_REFRESH_SECRET = 'refresh_secret';
  });

  describe('POST /login', () => {
    it('should return tokens for valid credentials', async () => {
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');
      (RefreshTokenModel.create as jest.Mock).mockResolvedValue({ token: 'refresh_token', userId: 1 });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ accessToken: 'access_token', refreshToken: 'refresh_token' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'kedVpf3TBduN', { expiresIn: '1h' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'refresh_secret', { expiresIn: '7d' });
      expect(RefreshTokenModel.create).toHaveBeenCalledWith('refresh_token', 1);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Identifiants invalides' });
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(RefreshTokenModel.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /refresh', () => {
    it('should return new access token for valid refresh token', async () => {
      (RefreshTokenModel.findByToken as jest.Mock).mockResolvedValue({ token: 'valid_refresh_token', userId: 1 });
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });
      (jwt.sign as jest.Mock).mockReturnValue('new_access_token');

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'valid_refresh_token' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ accessToken: 'new_access_token' });
      expect(jwt.verify).toHaveBeenCalledWith('valid_refresh_token', 'refresh_secret');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'kedVpf3TBduN', { expiresIn: '1h' });
    });

    it('should return 400 if refresh token is missing', async () => {
      const response = await request(app).post('/api/auth/refresh').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Refresh token requis' });
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should return 401 if refresh token is invalid', async () => {
      (RefreshTokenModel.findByToken as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid_refresh_token' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Refresh token invalide ou expiré' });
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});