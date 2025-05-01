import express, { Application, Request, Response } from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenue sur l'API Todo App !");
});

export default app;
