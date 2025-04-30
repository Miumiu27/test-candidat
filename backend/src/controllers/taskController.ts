import { Request, Response } from 'express';
import { TaskModel } from '../models/taskModel';

export class TaskController {
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      console.log('Contrôleur createTask atteint');
      const { title, description, isDone } = req.body;
      if (!title) {
        res.status(400).json({ error: 'Le titre est requis' });
        return;
      }
      const newTask = await TaskModel.create({ title, description, isDone });
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Erreur dans createTask:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}
