import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.post('/tasks', TaskController.createTask);
router.get('/tasks', TaskController.getAllTasks);

export default router;
