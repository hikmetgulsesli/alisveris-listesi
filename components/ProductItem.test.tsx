import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductItem from './ProductItem';
import { Product } from '@/types';

const mockProduct: Product = {
  id: 'test-id-1',
  name: 'Amasya Elması',
  category: 'meyve',
  quantity: 2,
  checked: false,
  createdAt: Date.now(),
};

const mockProductChecked: Product = {
  ...mockProduct,
  id: 'test-id-2',
  checked: true,
};

const defaultProps = {
  product: mockProduct,
  onToggle: vi.fn(),
  onRemove: vi.fn(),
  onUpdate: vi.fn(),
};

describe('ProductItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders checkbox, name, quantity badge, and delete button', () => {
      render(<ProductItem {...defaultProps} />);

      // Checkbox
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      // Name
      expect(screen.getByText('Amasya Elması')).toBeInTheDocument();

      // Quantity badge (2 kg for meyve category)
      expect(screen.getByText('2 kg')).toBeInTheDocument();

      // Delete button
      const deleteButton = screen.getByRole('button', { name: /ürünü sil/i });
      expect(deleteButton).toBeInTheDocument();
    });

    it('renders category emoji indicator', () => {
      render(<ProductItem {...defaultProps} />);
      // Meyve category has 🍎 emoji
      expect(screen.getByText('🍎')).toBeInTheDocument();
    });

    it('shows checked state with line-through and opacity', () => {
      render(<ProductItem {...defaultProps} product={mockProductChecked} />);
      const nameEl = screen.getByText('Amasya Elması');
      expect(nameEl).toHaveClass('line-through');
    });
  });

  describe('Toggle', () => {
    it('calls toggleProduct when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(defaultProps.onToggle).toHaveBeenCalledWith('test-id-1');
    });

    it('checkbox is unchecked by default for unchecked product', () => {
      render(<ProductItem {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('checkbox is checked for checked product', () => {
      render(<ProductItem {...defaultProps} product={mockProductChecked} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('Delete', () => {
    it('calls deleteProduct when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      const deleteButton = screen.getByRole('button', { name: /ürünü sil/i });
      await user.click(deleteButton);

      expect(defaultProps.onRemove).toHaveBeenCalledWith('test-id-1');
    });

    it('calls deleteProduct immediately without confirmation', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      const deleteButton = screen.getByRole('button', { name: /ürünü sil/i });
      await user.click(deleteButton);

      // Should be called immediately (no confirmation dialog)
      expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Inline Edit - Name', () => {
    it('enters edit mode when product name is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      const nameButton = screen.getByRole('button', { name: /Amasya Elması — düzenlemek için tıklayın/i });
      await user.click(nameButton);

      // Input field should appear
      const inputEl = screen.getByRole('textbox');
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toHaveValue('Amasya Elması');
    });

    it('saves on Enter key', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      // Enter edit mode
      const nameButton = screen.getByRole('button', { name: /Amasya Elması — düzenlemek için tıklayın/i });
      await user.click(nameButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Yeşil Elma');
      await user.keyboard('{Enter}');

      expect(defaultProps.onUpdate).toHaveBeenCalledWith('test-id-1', { name: 'Yeşil Elma' });
    });

    it('saves on blur', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      // Enter edit mode
      const nameButton = screen.getByRole('button', { name: /Amasya Elması — düzenlemek için tıklayın/i });
      await user.click(nameButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Kırmızı Elma');
      await user.tab();

      expect(defaultProps.onUpdate).toHaveBeenCalledWith('test-id-1', { name: 'Kırmızı Elma' });
    });

    it('cancels on Escape', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      // Enter edit mode
      const nameButton = screen.getByRole('button', { name: /Amasya Elması — düzenlemek için tıklayın/i });
      await user.click(nameButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Yeni İsim');
      await user.keyboard('{Escape}');

      // Should NOT call onUpdate with new name
      expect(defaultProps.onUpdate).not.toHaveBeenCalled();
      // Should revert to original name
      expect(screen.getByRole('button', { name: /Amasya Elması — düzenlemek için tıklayın/i })).toBeInTheDocument();
    });

    it('does not save if name is unchanged', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      const nameButton = screen.getByRole('button', { name: /Amasya Elması — düzenlemek için tıklayın/i });
      await user.click(nameButton);

      // Don't change the value, just press Enter
      await user.keyboard('{Enter}');

      // Should NOT call onUpdate since name didn't change
      expect(defaultProps.onUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Inline Edit - Quantity', () => {
    it('enters edit mode when quantity badge is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      const qtyButton = screen.getByRole('button', { name: /Miktar: 2 kg — düzenlemek için tıklayın/i });
      await user.click(qtyButton);

      // Number input should appear
      const numInput = document.querySelector('input[type="number"]');
      expect(numInput).toBeInTheDocument();
    });

    it('saves new quantity on Enter', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      // Enter edit mode
      const qtyButton = screen.getByRole('button', { name: /Miktar: 2 kg — düzenlemek için tıklayın/i });
      await user.click(qtyButton);

      const numInput = document.querySelector('input[type="number"]') as HTMLInputElement;
      await user.clear(numInput);
      await user.type(numInput, '5');
      await user.keyboard('{Enter}');

      expect(defaultProps.onUpdate).toHaveBeenCalledWith('test-id-1', { quantity: 5 });
    });

    it('cancels on Escape', async () => {
      const user = userEvent.setup();
      render(<ProductItem {...defaultProps} />);

      const qtyButton = screen.getByRole('button', { name: /Miktar: 2 kg — düzenlemek için tıklayın/i });
      await user.click(qtyButton);

      const numInput = document.querySelector('input[type="number"]') as HTMLInputElement;
      await user.clear(numInput);
      await user.type(numInput, '10');
      await user.keyboard('{Escape}');

      expect(defaultProps.onUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Touch Target', () => {
    it('row has minimum height of 56px (44px touch target)', () => {
      const { container } = render(<ProductItem {...defaultProps} />);
      const row = container.firstChild as HTMLElement;
      // min-h-[56px] from design = 56px minimum
      expect(row).toHaveClass('min-h-[56px]');
    });
  });

  describe('No Dividers', () => {
    it('does not have border dividers between items', () => {
      const { container } = render(<ProductItem {...defaultProps} />);
      const row = container.firstChild as HTMLElement;
      // Should NOT have border classes like border-b, border-t, border-gray, etc.
      const classList = Array.from(row.classList);
      const borderClasses = classList.filter(c => c.includes('border'));
      expect(borderClasses).toHaveLength(0);
    });
  });
});
