import { useState, useEffect } from 'react';
import api from '../api/api';
import { Task } from '../types';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'done' | 'todo';
  filteredTasks: Task[];
  setFilter: (filter: 'all' | 'done' | 'todo') => void;
  toggleTaskStatus: (task: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useTasks = (refresh: boolean): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'done' | 'todo'>('all');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des tâches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [refresh]);

  const toggleTaskStatus = async (task: Task) => {
    try {
      await api.put(`/api/tasks/${task.id}`, { ...task, isDone: !task.isDone });
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, isDone: !task.isDone } : t))
      );
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'done') return task.isDone;
    if (filter === 'todo') return !task.isDone;
    return true;
  });

  return {
    tasks,
    loading,
    error,
    filter,
    filteredTasks,
    setFilter,
    toggleTaskStatus,
    deleteTask,
  };
};