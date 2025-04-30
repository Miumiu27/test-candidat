import express, { Application, Request, Response } from "express";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from './routes/authRoutes';

const app: Application = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api", taskRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenue sur l'API Todo App !");
});

export default app;
