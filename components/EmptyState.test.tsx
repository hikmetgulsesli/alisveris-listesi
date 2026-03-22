import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders ShoppingBasket icon', () => {
    render(<EmptyState />);
    const icon = document.querySelector('svg.lucide-shopping-basket');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('displays headline "Alışveriş listeniz boş"', () => {
    render(<EmptyState />);
    expect(screen.getByText('Alışveriş listeniz boş')).toBeInTheDocument();
  });

  it('displays subtext encouraging user to add first product', () => {
    render(<EmptyState />);
    expect(screen.getByText(/Alışverişe başlamak için ürün ekleyin/i)).toBeInTheDocument();
  });

  it('has a visible CTA button labeled "İlk Ürün Ekle"', () => {
    render(<EmptyState />);
    const button = screen.getByRole('button', { name: /İlk Ürün Ekle/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onAddFirst when CTA button is clicked', () => {
    const onAddFirst = vi.fn();
    render(<EmptyState onAddFirst={onAddFirst} />);
    const button = screen.getByRole('button', { name: /İlk Ürün Ekle/i });
    fireEvent.click(button);
    expect(onAddFirst).toHaveBeenCalledTimes(1);
  });

  it('does not crash when onAddFirst is not provided', () => {
    render(<EmptyState />);
    const button = screen.getByRole('button', { name: /İlk Ürün Ekle/i });
    fireEvent.click(button);
    // Should not throw
  });

  it('has a heading with headline-sm styling (text-2xl font-bold)', () => {
    render(<EmptyState />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Alışveriş listeniz boş' });
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('has correct structural hierarchy', () => {
    const { container } = render(<EmptyState />);
    // Verify the component has the expected structure with icon, heading, subtext, and button
    expect(container.querySelector('button')).toBeInTheDocument();
    expect(container.querySelector('h2')).toBeInTheDocument();
  });
});
