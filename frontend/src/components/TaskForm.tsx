import { useState, FormEvent, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import api from '../api/api';
import { Task } from '../types';

interface TaskFormProps {
  onTaskAdded: () => void;
  taskToEdit?: Task | null;
  onEditComplete?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded, taskToEdit, onEditComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const isEditing = !!taskToEdit;


  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditing && taskToEdit) {
        await api.put(`/api/tasks/${taskToEdit.id}`, {
          title: title || taskToEdit.title, 
          description: description || taskToEdit.description || '', 
          isDone: taskToEdit.isDone,
        });
        onEditComplete?.();
      } else {
        if (!title) {
          alert('Le titre est requis');
          return;
        }
        await api.post('/api/tasks', { title, description, isDone: false });
      }
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (error) {
      console.error(`Erreur lors de ${isEditing ? 'la modification' : "l'ajout"} de la tâche`, error);
      alert(`Erreur lors de ${isEditing ? 'la modification' : "l'ajout"} de la tâche`);
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
              required={!isEditing} 
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
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={onEditComplete}
            >
              Annuler
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;