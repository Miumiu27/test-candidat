import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.post('/tasks', TaskController.createTask);

// Route de test
router.get('/test', (req, res) => {
  res.send('Route de test fonctionnelle');
});

export default router;
