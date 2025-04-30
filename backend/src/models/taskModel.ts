interface Task {
    id: number;
    title: string;
    description?: string;
    isDone: boolean;
  }
  
  let tasks: Task[] = [];
  let nextId = 1;
  
  export class TaskModel {
    static async create(taskData: Omit<Task, 'id'>): Promise<Task> {
      const newTask: Task = {
        id: nextId++,
        title: taskData.title,
        description: taskData.description,
        isDone: taskData.isDone ?? false,
      };
      tasks.push(newTask);
      return newTask;
    }

    static async findAll(): Promise<Task[]> {
      return tasks;
    }

    static async delete(id: number): Promise<boolean> {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return false;
      tasks.splice(index, 1);
      return true;
    }

    static async update(id: number, taskData: Partial<Task>): Promise<Task | null> {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;
      Object.assign(task, taskData);
      return task;
    }
  
  }
  