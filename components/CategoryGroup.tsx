'use client';

import { Product, CategoryId } from '@/types';
import { getCategory } from '@/lib/categories';
import ProductItem from './ProductItem';

interface CategoryGroupProps {
  categoryId: string;
  products: Product[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
}

export default function CategoryGroup({ categoryId, products, onToggle, onRemove, onUpdate }: CategoryGroupProps) {
  const category = getCategory(categoryId as CategoryId);
  if (!category) return null;

  // checkedCount available for future use
  // const checkedCount = products.filter((p) => p.checked).length;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-headline font-semibold text-xl text-on-surface flex items-center gap-2">
          <span>{category.emoji}</span>
          <span>{category.label}</span>
          <span className="text-sm font-normal text-outline ml-1">({products.length})</span>
        </h3>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onToggle={onToggle}
            onRemove={onRemove}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}
