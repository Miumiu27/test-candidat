import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle, toggleVariants } from '../src/components/ui/toggle';

// Mock de la fonction cn pour simplifier les tests
jest.mock('../src/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

// Configuration de userEvent
const user = userEvent.setup();

describe('Toggle', () => {
  // Test de rendu de base
  it('renders with default props', () => {
    render(<Toggle data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveClass(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    );
    expect(toggle).toHaveClass('bg-gray-200 hover:bg-gray-300');
    expect(toggle).toHaveClass('h-10 px-3');
    expect(toggle).toHaveTextContent('Toggle');
  });

  // Test des différentes variantes
  it.each([
    ['default', 'bg-gray-200 hover:bg-gray-300'],
    ['outline', 'border border-gray-300 bg-transparent hover:bg-gray-100'],
  ])('renders %s variant correctly', (variant, expectedClasses) => {
    render(<Toggle variant={variant} data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass(expectedClasses);
  });

  // Test des différentes tailles
  it.each([
    ['default', 'h-10 px-3'],
    ['sm', 'h-9 px-2.5'],
    ['lg', 'h-11 px-5'],
  ])('renders %s size correctly', (size, expectedClasses) => {
    render(<Toggle size={size} data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass(expectedClasses);
  });

  // Test de la prop className
  it('applies custom className', () => {
    render(<Toggle className="custom-class" data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass('custom-class');
    expect(toggle).toHaveClass(toggleVariants({ variant: 'default', size: 'default' }));
  });

  // Test du comportement disabled
  it('applies disabled attribute and prevents interaction', async () => {
    const handleClick = jest.fn();
    render(<Toggle disabled onPressedChange={handleClick} data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveAttribute('disabled');
    await user.click(toggle);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test du basculement d'état
  it('toggles state correctly', async () => {
    const handlePressedChange = jest.fn();
    render(<Toggle onPressedChange={handlePressedChange} data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');

    // État initial : off
    expect(toggle).not.toHaveAttribute('data-state', 'on');

    // Clique pour activer
    await user.click(toggle);
    expect(toggle).toHaveAttribute('data-state', 'on');
    expect(toggle).toHaveClass('data-[state=on]:bg-blue-600 data-[state=on]:text-white');
    expect(handlePressedChange).toHaveBeenCalledWith(true);

    // Clique pour désactiver
    await user.click(toggle);
    expect(toggle).toHaveAttribute('data-state', 'off');
    expect(handlePressedChange).toHaveBeenCalledWith(false);
  });

  // Test du forwardRef
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Toggle ref={ref} data-testid="toggle">Toggle</Toggle>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // Test des attributs HTML
  it('passes through HTML attributes', () => {
    render(<Toggle id="toggle-id" aria-label="Toggle button" data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveAttribute('id', 'toggle-id');
    expect(toggle).toHaveAttribute('aria-label', 'Toggle button');
  });

  // Test du focus
  it('applies focus styles when focused', async () => {
    render(<Toggle data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    await user.tab();
    expect(toggle).toHaveClass('focus-visible:ring-2 focus-visible:ring-offset-2');
  });
});