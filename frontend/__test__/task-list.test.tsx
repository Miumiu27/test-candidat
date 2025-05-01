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

  // Les autres tests restent inchangés, seuls les tests suivants sont modifiés :

  test("handles API error when loading tasks", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (api.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await act(async () => {
      render(<TaskList refresh={false} onEditTask={mockOnEditTask} />);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error)); // Correction
    });

    expect(
      await screen.findByText("Erreur lors du chargement des tâches") // Correction
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
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error)); // Correction
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
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error)); // Correction
    });

    consoleErrorSpy.mockRestore();
  });
});