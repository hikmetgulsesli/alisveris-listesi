'use client';

import { useState, FormEvent } from 'react';

import { CategoryId } from '@/types';
import { categories } from '@/lib/categories';

interface ProductFormProps {
  onAdd: (name: string, category: CategoryId, quantity: number) => void;
}

export default function ProductForm({ onAdd }: ProductFormProps) {
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
    <section className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-4 text-on-surface">Yeni Ürün Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-outline" htmlFor="product-name">
            Ürün Adı
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ürün adı..."
            className="w-full h-12 px-4 bg-surface-container-low dark:bg-surface-container-high/10 rounded-lg border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline/60"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline" htmlFor="product-category">
              Kategori
            </label>
            <select
              id="product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="w-full h-12 px-4 bg-surface-container-low dark:bg-surface-container-high/10 rounded-lg border-none focus:ring-2 focus:ring-primary/40 text-on-surface appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline" htmlFor="product-quantity">
              Miktar
            </label>
            <input
              id="product-quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-full h-12 px-4 bg-surface-container-low dark:bg-surface-container-high/10 rounded-lg border-none focus:ring-2 focus:ring-primary/40 text-on-surface cursor-pointer"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full h-12 mt-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl active:scale-[0.98] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Ekle
        </button>
      </form>
    </section>
  );
}
