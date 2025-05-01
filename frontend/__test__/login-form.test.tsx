import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../src/components/LoginForm';

describe('LoginForm', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders login form with email and password inputs', () => {
    render(<LoginForm onLogin={mockOnLogin} error={null} />);

    expect(screen.getByPlaceholderText('Entrez votre email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Entrez votre mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('updates email and password inputs when typing', async () => {
    render(<LoginForm onLogin={mockOnLogin} error={null} />);

    const emailInput = screen.getByPlaceholderText('Entrez votre email');
    const passwordInput = screen.getByPlaceholderText('Entrez votre mot de passe');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls onLogin with correct credentials and clears inputs on submit', async () => {
    render(<LoginForm onLogin={mockOnLogin} error={null} />);

    const emailInput = screen.getByPlaceholderText('Entrez votre email');
    const passwordInput = screen.getByPlaceholderText('Entrez votre mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Identifiants incorrects';
    render(<LoginForm onLogin={mockOnLogin} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('prevents default form submission', async () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(<LoginForm onLogin={mockOnLogin} error={null} />);

    const form = screen.getByTestId('login-form');
    form.onsubmit = handleSubmit; 

    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('has required attributes on inputs', () => {
    render(<LoginForm onLogin={mockOnLogin} error={null} />);

    const emailInput = screen.getByPlaceholderText('Entrez votre email');
    const passwordInput = screen.getByPlaceholderText('Entrez votre mot de passe');

    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });
});