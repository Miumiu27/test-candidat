import request from 'supertest';
import app from '../src/app';
import { TaskModel } from '../src/models/taskModel';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/taskModel');

describe('Task Routes', () => {
  let token: string;

  beforeEach(() => {
    jest.clearAllMocks();
    const secret = process.env.JWT_SECRET || 'test-secret';
    token = jwt.sign({ userId: 1 }, secret, { expiresIn: '1h' });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      (TaskModel.create as jest.Mock).mockResolvedValue({
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        isDone: false,
      });

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Task', description: 'This is a test task' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'This is a test task' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Le titre est requis');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      (TaskModel.findAll as jest.Mock).mockResolvedValue([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ]);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      (TaskModel.delete as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/tasks/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 if task is not found', async () => {
      (TaskModel.delete as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/tasks/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tâche non trouvée');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      (TaskModel.update as jest.Mock).mockResolvedValue({
        id: 1,
        title: 'Updated Task',
        description: 'This is an updated task',
        isDone: 'This is an updated task',
      });

      const response = await request(app)
        .put('/api/tasks/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Task', description: 'This is an updated task' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
    });

    it('should return 404 if task is not found', async () => {
      (TaskModel.update as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/tasks/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Task', description: 'This is an updated task' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tâche non trouvée');
    });
  });
});