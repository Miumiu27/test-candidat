import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, buttonVariants } from '../src/components/ui/button';

// Configuration de userEvent
const user = userEvent.setup();

describe('Button', () => {
  // Test de rendu de base
  it('renders button with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600 text-white');
    expect(button).toHaveClass('h-10 py-2 px-4');
  });

  // Test des différentes variantes
  it.each([
    ['default', 'bg-blue-600 text-white'],
    ['destructive', 'bg-red-600 text-white'],
    ['outline', 'border border-gray-300 bg-white'],
    ['secondary', 'bg-gray-200 text-gray-900'],
    ['ghost', 'text-gray-900'],
    ['link', 'underline text-blue-600'],
  ])('renders %s variant correctly', (variant, expectedClasses) => {
    render(<Button variant={variant}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass(expectedClasses);
  });

  // Test des différentes tailles
  it.each([
    ['default', 'h-10 py-2 px-4'],
    ['sm', 'h-9 px-3'],
    ['lg', 'h-11 px-8'],
    ['icon', 'h-10 w-10'],
  ])('renders %s size correctly', (size, expectedClasses) => {
    render(<Button size={size}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass(expectedClasses);
  });

  // Test de la prop className
  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('custom-class');
  });

  // Test de la prop asChild
  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: /link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass(buttonVariants({ variant: 'default', size: 'default' }));
  });

  // Test du comportement disabled
  it('applies disabled attribute and prevents click when disabled', async () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveAttribute('disabled');
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test du forwardRef
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // Test des autres props HTML
  it('passes through HTML attributes', () => {
    render(<Button type="submit" id="test-button">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'test-button');
  });

  // Test du focus visible
  it('applies focus-visible styles', async () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    await user.tab();
    expect(button).toHaveClass('focus-visible:ring-2 focus-visible:ring-offset-2');
  });
});