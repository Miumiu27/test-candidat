import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Toggle } from './ui/toggle';
import { Trash2 } from 'lucide-react';
import api from '../api/api';
import { Task } from '../types';

interface TaskListProps {
  refresh: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ refresh }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches', error);
      }
    };
    fetchTasks();
  }, [refresh]);

  const toggleTaskStatus = async (task: Task) => {
    try {
      await api.put(`/api/tasks/${task.id}`, { ...task, isDone: !task.isDone });
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, isDone: !t.isDone } : t)));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche', error);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">Aucune tâche pour le moment.</p>
      ) : (
        tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <h3
                  className={
                    task.isDone ? 'line-through text-gray-500' : 'font-medium text-gray-900'
                  }
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  pressed={task.isDone}
                  onPressedChange={() => toggleTaskStatus(task)}
                  aria-label={task.isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
                >
                  {task.isDone ? 'Fait' : 'À faire'}
                </Toggle>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  aria-label="Supprimer la tâche"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TaskList;