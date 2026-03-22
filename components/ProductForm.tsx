'use client';

import { useState, FormEvent, forwardRef } from 'react';
import { Plus } from 'lucide-react';
import { CategoryId } from '@/types';
import { categories } from '@/lib/categories';

interface ProductFormProps {
  onAdd: (name: string, category: CategoryId, quantity: number) => void;
}

const ProductForm = forwardRef<HTMLInputElement, ProductFormProps>(
  function ProductForm({ onAdd }, ref) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<CategoryId>('market');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (name.trim()) {
        onAdd(name.trim(), category, quantity);
        setName('');
        setQuantity(1);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="bg-[var(--color-surface-container-lowest)] rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              ref={ref}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ürün adı..."
              className="flex-1 px-4 py-3 bg-[var(--color-surface-container-low)] rounded-xl text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-3 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] font-semibold rounded-xl hover:from-[var(--color-primary-container)] hover:to-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              <span>Ekle</span>
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="flex-1 px-4 py-2 bg-[var(--color-surface-container-low)] rounded-xl text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-20 px-3 py-2 bg-[var(--color-surface-container-low)] rounded-xl text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] text-center"
            />
          </div>
        </div>
      </form>
    );
  }
);

export default ProductForm;
