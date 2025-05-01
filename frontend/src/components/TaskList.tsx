// src/components/TaskList.tsx
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Toggle } from './ui/toggle';
import { Trash2, Edit2 } from 'lucide-react';
import api from '../api/api';
import { Task } from '../types';

interface TaskListProps {
  refresh: boolean;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ refresh, onEditTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'done' | 'todo'>('all');

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
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, isDone: !t.isDone } : t))
      );
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

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'done') return task.isDone;
    if (filter === 'todo') return !task.isDone;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Toutes
        </Button>
        <Button
          variant={filter === 'done' ? 'default' : 'outline'}
          onClick={() => setFilter('done')}
        >
          Faites
        </Button>
        <Button
          variant={filter === 'todo' ? 'default' : 'outline'}
          onClick={() => setFilter('todo')}
        >
          À faire
        </Button>
      </div>
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">
          {filter === 'done'
            ? 'Aucune tâche terminée.'
            : filter === 'todo'
            ? 'Aucune tâche à faire.'
            : 'Aucune tâche pour le moment.'}
        </p>
      ) : (
        filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <h3
                  className={
                    task.isDone
                      ? 'line-through text-gray-500'
                      : 'font-medium text-gray-900'
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
                  aria-label={
                    task.isDone ? 'Marquer comme non fait' : 'Marquer comme fait'
                  }
                  data-testid={`toggle-task-${task.id}`} // Ajout du data-testid
                >
                  {task.isDone ? 'Fait' : 'À faire'}
                </Toggle>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEditTask(task)}
                  aria-label="Modifier la tâche"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
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