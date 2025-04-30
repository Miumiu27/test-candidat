import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.post('/tasks', TaskController.createTask);
router.get('/tasks', TaskController.getAllTasks);
router.delete('/tasks/:id', TaskController.deleteTask);

export default router;
