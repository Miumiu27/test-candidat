import { useState } from 'react';
import { Button } from './components/ui/button';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LoginForm from './components/LoginForm'; 
import api from './api/api';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      setToken(response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setError(null); 
    } catch (error) {
      console.error('Erreur de connexion', error);
      setError('Identifiants invalides'); 
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const handleTaskAdded = () => {
    setRefresh(!refresh);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} error={error} />; 
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Todo App</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Déconnexion
        </Button>
      </header>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList refresh={refresh} />
    </div>
  );
};

export default App;
