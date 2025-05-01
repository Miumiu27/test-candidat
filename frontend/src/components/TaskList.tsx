import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Toggle } from './ui/toggle';
import { Trash2, Edit2 } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../hooks/UseTasks';
interface TaskListProps {
  refresh: boolean;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ refresh, onEditTask }) => {
  const { filteredTasks, loading, error, filter, setFilter, toggleTaskStatus, deleteTask } = useTasks(refresh);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

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
                  data-testid={`toggle-task-${task.id}`}
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