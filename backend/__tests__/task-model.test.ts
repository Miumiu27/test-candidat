let TaskModel: typeof import('../src/models/taskModel').TaskModel;
let tasks: Task[];
let nextId: number;

beforeEach(async () => {
  jest.resetModules();
  const module = await import('../src/models/taskModel');
  TaskModel = module.TaskModel;
  tasks = module.tasks;
  nextId = module.nextId;
  module.tasks.length = 0;
  module.nextId = 1;
});

describe('TaskModel', () => {
  describe('create', () => {
    it('should create a new task', async () => {
      const newTask = await TaskModel.create({
        title: 'Test Task',
        description: 'This is a test task',
        isDone: false,
      });
      expect(newTask).toHaveProperty('id', 1);
      expect(newTask.title).toBe('Test Task');
      expect(newTask.description).toBe('This is a test task');
      expect(newTask.isDone).toBe(false);
      expect(tasks).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      await TaskModel.create({ title: 'Task 1', description: 'Description 1', isDone: false });
      await TaskModel.create({ title: 'Task 2', description: 'Description 2', isDone: true });
      const tasksList = await TaskModel.findAll();
      expect(tasksList).toHaveLength(2);
      expect(tasksList[0]).toMatchObject({
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        isDone: false,
      });
      expect(tasksList[1]).toMatchObject({
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        isDone: true,
      });
      expect(tasks).toHaveLength(2);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      await TaskModel.create({ title: 'Task 1', description: 'Description 1', isDone: false });
      const result = await TaskModel.delete(1);
      expect(result).toBe(true);
      const tasksList = await TaskModel.findAll();
      expect(tasksList).toHaveLength(0);
      expect(tasks).toHaveLength(0);
    });

    it('should return false if task is not found', async () => {
      const result = await TaskModel.delete(1);
      expect(result).toBe(false);
      const tasksList = await TaskModel.findAll();
      expect(tasksList).toHaveLength(0);
      expect(tasks).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      await TaskModel.create({ title: 'Task 1', description: 'Description 1', isDone: false });
      const updatedTask = await TaskModel.update(1, {
        title: 'Updated Task',
        description: 'Updated Description',
        isDone: true,
      });
      expect(updatedTask).toMatchObject({
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        isDone: true,
      });
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toMatchObject({
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        isDone: true,
      });
    });

    it('should return null if task is not found', async () => {
      const updatedTask = await TaskModel.update(1, {
        title: 'Updated Task',
        description: 'Updated Description',
        isDone: true,
      });
      expect(updatedTask).toBeNull();
      expect(tasks).toHaveLength(0);
    });
  });
});