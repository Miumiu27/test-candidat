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
      console.log('Nouvelle tâche créée:', newTask);
      return newTask;
    }
  }
  