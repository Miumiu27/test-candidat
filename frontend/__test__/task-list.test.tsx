import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "../src/components/TaskList";
import api from "../src/api/api";

jest.mock("../src/api/api", () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("TaskList Component", () => {
  const mockTasks = [
    { id: 1, title: "Tâche 1", description: "Description 1", isDone: false },
    { id: 2, title: "Tâche 2", description: "Description 2", isDone: true },
    { id: 3, title: "Tâche 3", description: "", isDone: false },
  ];

  const mockOnEditTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({ data: mockTasks });
    (api.put as jest.Mock).mockResolvedValue({});
    (api.delete as jest.Mock).mockResolvedValue({});
  });

  test("renders the task list correctly", async () => {
    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tasks");
    });

    expect(await screen.findByText("Tâche 1")).toBeInTheDocument();
    expect(await screen.findByText("Tâche 2")).toBeInTheDocument();
    expect(await screen.findByText("Tâche 3")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toutes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Faites" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^À faire$/i })
    ).toBeInTheDocument(); // Cible le bouton de filtre
  });

  test("filters tasks correctly", async () => {
    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await screen.findByText("Tâche 1");

    // Filter by done
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Faites" }));
    });

    expect(screen.queryByText("Tâche 1")).not.toBeInTheDocument();
    expect(screen.getByText("Tâche 2")).toBeInTheDocument();
    expect(screen.queryByText("Tâche 3")).not.toBeInTheDocument();

    // Filter by todo
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^À faire$/i }));
    });

    expect(screen.getByText("Tâche 1")).toBeInTheDocument();
    expect(screen.queryByText("Tâche 2")).not.toBeInTheDocument();
    expect(screen.getByText("Tâche 3")).toBeInTheDocument();

    // Show all tasks
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Toutes" }));
    });

    expect(screen.getByText("Tâche 1")).toBeInTheDocument();
    expect(screen.getByText("Tâche 2")).toBeInTheDocument();
    expect(screen.getByText("Tâche 3")).toBeInTheDocument();
  });

  test("toggles task status correctly", async () => {
    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await screen.findByText("Tâche 1");

    // S'assurer que le filtre est sur "all"
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Toutes" }));
    });

    const toggleButton = screen.getByTestId("toggle-task-1");

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/tasks/1", {
        id: 1,
        title: "Tâche 1",
        description: "Description 1",
        isDone: true,
      });
    });
  });

  test("deletes task correctly", async () => {
    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await screen.findByText("Tâche 1");

    const deleteButtons = await screen.findAllByLabelText("Supprimer la tâche");
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/api/tasks/1");
    });
  });

  test("calls onEditTask when edit button is clicked", async () => {
    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await screen.findByText("Tâche 1");

    const editButtons = await screen.findAllByLabelText("Modifier la tâche");
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    expect(mockOnEditTask).toHaveBeenCalledWith(mockTasks[0]);
  });

  test("displays empty state message when no tasks", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    expect(
      await screen.findByText("Aucune tâche pour le moment.")
    ).toBeInTheDocument();
  });

  test("refreshes tasks when refresh prop changes", async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(
        <TaskList refresh={false} onEditTask={mockOnEditTask} />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
    });

    (api.get as jest.Mock).mockClear();

    await act(async () => {
      renderResult.rerender(
        <TaskList refresh={true} onEditTask={mockOnEditTask} />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
    });
  });

  test("handles API error when loading tasks", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (api.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erreur lors du chargement des tâches",
        expect.any(Error)
      );
    });

    expect(
      await screen.findByText("Aucune tâche pour le moment.")
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test("handles API error when toggling task status", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await screen.findByText("Tâche 1");

    (api.put as jest.Mock).mockRejectedValue(new Error("API Error"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Toutes" }));
    });

    const toggleButton = screen.getByTestId("toggle-task-1");

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erreur lors de la mise à jour de la tâche",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("handles API error when deleting task", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await screen.findByText("Tâche 1");

    (api.delete as jest.Mock).mockRejectedValue(new Error("API Error"));

    const deleteButtons = await screen.findAllByLabelText("Supprimer la tâche");
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erreur lors de la suppression de la tâche",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
