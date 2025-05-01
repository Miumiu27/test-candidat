let RefreshTokenModel: typeof import('../src/models/refreshTokenModel').RefreshTokenModel;

beforeEach(async () => {
  jest.resetModules();
  const module = await import('../src/models/refreshTokenModel');
  RefreshTokenModel = module.RefreshTokenModel;
  Object.defineProperty(module, 'tokens', { value: [], writable: true });
});

describe('RefreshTokenModel', () => {
  describe('create', () => {
    it('should create a refresh token', async () => {
      const token = await RefreshTokenModel.create('refresh_token', 1);
      expect(token).toEqual({
        token: 'refresh_token',
        userId: 1,
        expiresAt: expect.any(Date),
      });
      expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('findByToken', () => {
    it('should find a valid token', async () => {
      await RefreshTokenModel.create('refresh_token', 1);
      const token = await RefreshTokenModel.findByToken('refresh_token');
      expect(token).toEqual({
        token: 'refresh_token',
        userId: 1,
        expiresAt: expect.any(Date),
      });
    });

    it('should return null for non-existent token', async () => {
      const token = await RefreshTokenModel.findByToken('non_existent');
      expect(token).toBeNull();
    });

    it('should return null for expired token', async () => {
      const token = await RefreshTokenModel.create('refresh_token', 1);
      token.expiresAt = new Date(Date.now() - 1000);
      const found = await RefreshTokenModel.findByToken('refresh_token');
      expect(found).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a token', async () => {
      await RefreshTokenModel.create('refresh_token', 1);
      const result = await RefreshTokenModel.delete('refresh_token');
      expect(result).toBe(true);
      const token = await RefreshTokenModel.findByToken('refresh_token');
      expect(token).toBeNull();
    });

    it('should return false for non-existent token', async () => {
      const result = await RefreshTokenModel.delete('non_existent');
      expect(result).toBe(false);
    });
  });
});