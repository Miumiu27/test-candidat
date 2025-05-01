import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.delete('/:id', TaskController.deleteTask);
router.put('/:id', TaskController.updateTask);

export default router;
