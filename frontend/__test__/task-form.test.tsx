import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../src/components/TaskForm';


jest.mock('../src/api/api', () => ({
  post: jest.fn(),
  put: jest.fn()
}));


import * as mockApi from '../src/api/api';

describe('TaskForm', () => {
  const mockOnTaskAdded = jest.fn();
  const mockOnEditComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with title and description inputs', () => {
    render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

    expect(screen.getByPlaceholderText('Titre de la tâche')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description (optionnel)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument();
  });

  it('updates title and description inputs when typing', async () => {
    render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

    const titleInput = screen.getByPlaceholderText('Titre de la tâche');
    const descriptionInput = screen.getByPlaceholderText('Description (optionnel)');

    await userEvent.type(titleInput, 'Nouvelle tâche');
    await userEvent.type(descriptionInput, 'Description de la tâche');

    expect(titleInput).toHaveValue('Nouvelle tâche');
    expect(descriptionInput).toHaveValue('Description de la tâche');
  });

  it('calls onTaskAdded with correct data and clears inputs on submit', async () => {
    (mockApi.post as jest.Mock).mockResolvedValueOnce({});

    render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

    const titleInput = screen.getByPlaceholderText('Titre de la tâche');
    const descriptionInput = screen.getByPlaceholderText('Description (optionnel)');
    const submitButton = screen.getByRole('button', { name: /ajouter/i });

    await userEvent.type(titleInput, 'Nouvelle tâche');
    await userEvent.type(descriptionInput, 'Description de la tâche');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/api/tasks', {
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        isDone: false,
      });
      expect(mockOnTaskAdded).toHaveBeenCalled();
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('displays an alert if title is missing on submit', async () => {
   
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    
    const { container } = render(
      <TaskForm 
        onTaskAdded={mockOnTaskAdded} 
        
        _testNoValidation={true}
      />
    );
    

    const form = container.querySelector('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Le titre est requis');
    });
  });

  it('handles task editing correctly', async () => {
    const taskToEdit = { id: 1, title: 'Tâche à éditer', description: 'Description à éditer', isDone: false };
    (mockApi.put as jest.Mock).mockResolvedValueOnce({});

    render(<TaskForm onTaskAdded={mockOnTaskAdded} taskToEdit={taskToEdit} onEditComplete={mockOnEditComplete} />);

    const titleInput = screen.getByPlaceholderText('Titre de la tâche');
    const descriptionInput = screen.getByPlaceholderText('Description (optionnel)');
    const submitButton = screen.getByRole('button', { name: /modifier/i });

    expect(titleInput).toHaveValue('Tâche à éditer');
    expect(descriptionInput).toHaveValue('Description à éditer');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Tâche modifiée');
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'Nouvelle description');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/api/tasks/1', {
        title: 'Tâche modifiée',
        description: 'Nouvelle description',
        isDone: false,
      });
      expect(mockOnEditComplete).toHaveBeenCalled();
    });
  });

  it('calls onEditComplete when cancel button is clicked', async () => {
    const taskToEdit = { id: 1, title: 'Tâche à éditer', description: 'Description à éditer', isDone: false };

    render(<TaskForm onTaskAdded={mockOnTaskAdded} taskToEdit={taskToEdit} onEditComplete={mockOnEditComplete} />);

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockOnEditComplete).toHaveBeenCalled();
    });
  });
});