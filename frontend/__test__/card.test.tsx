import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '../src/components/ui/card';

// Mock de la fonction cn pour simplifier les tests
jest.mock('../src/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

describe('Card Components', () => {
  describe('Card', () => {
    // Test de rendu de base
    it('renders with default props', () => {
      render(<Card data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-lg border border-gray-200 bg-white shadow-sm');
    });

    // Test de la prop className
    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('rounded-lg border border-gray-200 bg-white shadow-sm');
    });

    // Test du forwardRef
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref} data-testid="card" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    // Test des attributs HTML
    it('passes through HTML attributes', () => {
      render(<Card id="card-id" data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('id', 'card-id');
    });
  });

  describe('CardHeader', () => {
    // Test de rendu de base
    it('renders with default props', () => {
      render(<CardHeader data-testid="card-header" />);
      const header = screen.getByTestId('card-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('p-6');
    });

    // Test de la prop className
    it('applies custom className', () => {
      render(<CardHeader className="custom-header" data-testid="card-header" />);
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('custom-header');
      expect(header).toHaveClass('p-6');
    });

    // Test du forwardRef
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref} data-testid="card-header" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    // Test des attributs HTML
    it('passes through HTML attributes', () => {
      render(<CardHeader id="header-id" data-testid="card-header" />);
      const header = screen.getByTestId('card-header');
      expect(header).toHaveAttribute('id', 'header-id');
    });
  });

  describe('CardTitle', () => {
    // Test de rendu de base
    it('renders with default props', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title');
      expect(title).toHaveClass('text-lg font-semibold leading-none tracking-tight');
    });

    // Test de la prop className
    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('custom-title');
      expect(title).toHaveClass('text-lg font-semibold leading-none tracking-tight');
    });

    // Test du forwardRef
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<CardTitle ref={ref}>Title</CardTitle>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    // Test des attributs HTML
    it('passes through HTML attributes', () => {
      render(<CardTitle id="title-id" data-testid="title">Title</CardTitle>);
      const title = screen.getByTestId('title');
      expect(title).toHaveAttribute('id', 'title-id');
    });
  });

  describe('CardContent', () => {
    // Test de rendu de base
    it('renders with default props', () => {
      render(<CardContent data-testid="card-content" />);
      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6 pt-0');
    });

    // Test de la prop className
    it('applies custom className', () => {
      render(<CardContent className="custom-content" data-testid="card-content" />);
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('custom-content');
      expect(content).toHaveClass('p-6 pt-0');
    });

    // Test du forwardRef
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref} data-testid="card-content" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    // Test des attributs HTML
    it('passes through HTML attributes', () => {
      render(<CardContent id="content-id" data-testid="card-content" />);
      const content = screen.getByTestId('card-content');
      expect(content).toHaveAttribute('id', 'content-id');
    });
  });

  // Test d'intégration des composants ensemble
  describe('Card Integration', () => {
    it('renders Card with Header, Title, and Content correctly', () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="card-header">
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent data-testid="card-content">Card Content</CardContent>
        </Card>
      );

      const card = screen.getByTestId('card');
      const header = screen.getByTestId('card-header');
      const title = screen.getByRole('heading', { name: /card title/i });
      const content = screen.getByTestId('card-content');

      expect(card).toHaveClass('rounded-lg border border-gray-200 bg-white shadow-sm');
      expect(header).toHaveClass('p-6');
      expect(title).toHaveClass('text-lg font-semibold leading-none tracking-tight');
      expect(content).toHaveClass('p-6 pt-0');
      expect(content).toHaveTextContent('Card Content');
    });
  });
});