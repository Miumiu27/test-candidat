import { useState, FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import api from '../api/api';

interface TaskFormProps {
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/api/tasks', { title, description, isDone: false });
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (error) {
      console.error('Erreur lors de l’ajout de la tâche', error);
      alert('Erreur lors de l’ajout de la tâche');
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optionnel)"
            />
          </div>
          <Button type="submit" className="w-full">
            Ajouter
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;