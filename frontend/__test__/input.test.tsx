import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src/components/ui/input';

// Mock de la fonction cn pour simplifier les tests
jest.mock('../src/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

// Configuration de userEvent
const user = userEvent.setup();

describe('Input', () => {
  // Test de rendu de base
  it('renders with default props', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
    );
    // Pas d'attente pour type, car il n'est pas défini par défaut
  });

  // Test de la prop className
  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveClass(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
    );
  });

  // Test du type d'entrée
  it.each([
    ['text', 'text'],
    ['password', 'password'],
    ['email', 'email'],
    ['number', 'number'],
  ])('renders with type %s', (type, expectedType) => {
    render(<Input type={type} data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', expectedType);
  });

  // Test du comportement disabled
  it('applies disabled attribute and prevents interaction', async () => {
    const handleChange = jest.fn();
    render(<Input disabled onChange={handleChange} data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    await user.type(input, 'test');
    expect(handleChange).not.toHaveBeenCalled();
  });

  // Test du forwardRef
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // Test des attributs HTML
  it('passes through HTML attributes', () => {
    render(<Input id="input-id" placeholder="Enter text" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('id', 'input-id');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  // Test du focus
  it('applies focus styles when focused', async () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    await user.click(input);
    expect(input).toHaveClass('focus:ring-2 focus:ring-blue-500');
  });

  // Test de la saisie de texte
  it('allows text input', async () => {
    render(<Input type="text" data-testid="input" />);
    const input = screen.getByTestId('input');
    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  // Test du placeholder
  it('renders placeholder correctly', () => {
    render(<Input placeholder="Enter your name" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });
});