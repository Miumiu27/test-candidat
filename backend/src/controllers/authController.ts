import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const staticUser = {
        id: 1,
        email: process.env.STATIC_USER_EMAIL,
        password: process.env.STATIC_USER_PASSWORD,
      };

      if (email !== staticUser.email || password !== staticUser.password) {
        res.status(401).json({ error: "Identifiants invalides" });
        return;
      }

      const token = jwt.sign(
        { userId: staticUser.id },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "1h",
        }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
