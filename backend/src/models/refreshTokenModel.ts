interface RefreshToken {
  token: string;
  userId: number;
  expiresAt: Date;
}

export class RefreshTokenModel {
  private static tokens: RefreshToken[] = [];

  static async create(
    token: string,
    userId: number,
    expiresInDays: number = 7
  ): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const refreshToken: RefreshToken = { token, userId, expiresAt };
    this.tokens.push(refreshToken);
    return refreshToken;
  }

  static async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = this.tokens.find((t) => t.token === token);
    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }
    return refreshToken;
  }

  static async delete(token: string): Promise<boolean> {
    const index = this.tokens.findIndex((t) => t.token === token);
    if (index === -1) return false;
    this.tokens.splice(index, 1);
    return true;
  }
}
