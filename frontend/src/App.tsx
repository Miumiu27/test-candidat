import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/partials/Navbar";
import api from "./api/api";
import { Task } from "./types";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem("accessToken");
      if (!currentToken && token) {
        setToken(null);
      }
    };

    window.addEventListener("storage", checkToken);
    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, [token]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      setToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setError(null);
    } catch (error) {
      console.error("Erreur de connexion", error);
      setError("Identifiants invalides");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const handleTaskAdded = () => {
    setRefresh(!refresh);
    setTaskToEdit(null);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
  };

  const handleEditComplete = () => {
    setTaskToEdit(null);
    setRefresh(!refresh);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />

      <main className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <TaskForm
                onTaskAdded={handleTaskAdded}
                taskToEdit={taskToEdit}
                onEditComplete={handleEditComplete}
              />
            </div>
          </div>

          <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <TaskList refresh={refresh} onEditTask={handleEditTask} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
