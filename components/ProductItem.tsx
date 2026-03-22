'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { getCategory } from '@/lib/categories';

interface ProductItemProps {
  product: Product;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
}

export default function ProductItem({ product, onToggle, onRemove, onUpdate }: ProductItemProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editQuantity, setEditQuantity] = useState(product.quantity);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const category = getCategory(product.category);

  // Get quantity display text
  const getQuantityLabel = (qty: number) => {
    if (product.category === 'kasap') return `${qty} kg`;
    if (product.category === 'fırın') return `${qty} adet`;
    if (product.category === 'meyve') return `${qty} kg`;
    if (product.category === 'manav') return `${qty} kg`;
    return `${qty} adet`;
  };

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingQuantity && quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  }, [isEditingQuantity]);

  const handleNameSubmit = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== product.name) {
      onUpdate(product.id, { name: trimmed });
    } else {
      setEditName(product.name);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditName(product.name);
      setIsEditingName(false);
    }
  };

  const handleQuantitySubmit = () => {
    const qty = Math.max(1, Math.round(editQuantity));
    if (qty !== product.quantity) {
      onUpdate(product.id, { quantity: qty });
    } else {
      setEditQuantity(product.quantity);
    }
    setIsEditingQuantity(false);
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuantitySubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditQuantity(product.quantity);
      setIsEditingQuantity(false);
    }
  };

  const handleQuantityBlur = () => {
    handleQuantitySubmit();
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl min-h-[56px] group ${
        product.checked ? 'opacity-60' : ''
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={product.checked}
        onChange={() => onToggle(product.id)}
        className="w-6 h-6 rounded-lg border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
        aria-label={product.checked ? 'İşareti kaldır' : 'İşaretle'}
      />

      {/* Product info */}
      <div className="flex-1 flex justify-between items-center min-w-0">
        {/* Name - click to edit */}
        {isEditingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleNameKeyDown}
            className="flex-1 px-2 py-1 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 bg-surface-container-low"
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className={`font-medium text-on-surface truncate cursor-pointer text-left hover:text-primary transition-colors ${
              product.checked ? 'line-through' : ''
            }`}
            title="Düzenlemek için tıklayın"
            aria-label={`${product.name} — düzenlemek için tıklayın`}
          >
            {product.name}
          </button>
        )}

        {/* Quantity badge */}
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          {isEditingQuantity ? (
            <input
              ref={quantityInputRef}
              type="number"
              min="1"
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              onBlur={handleQuantityBlur}
              onKeyDown={handleQuantityKeyDown}
              className="w-16 px-2 py-1 border border-outline-variant rounded-lg text-sm text-on-surface text-center focus:outline-none focus:ring-2 focus:ring-primary/40 bg-surface-container-low"
            />
          ) : (
            <button
              onClick={() => setIsEditingQuantity(true)}
              className="text-sm text-outline px-3 py-1 bg-surface-container-low dark:bg-white/5 rounded-full cursor-pointer hover:bg-surface-container transition-colors"
              title="Miktarı düzenlemek için tıklayın"
              aria-label={`Miktar: ${getQuantityLabel(product.quantity)} — düzenlemek için tıklayın`}
            >
              {getQuantityLabel(product.quantity)}
            </button>
          )}

          {/* Category emoji indicator */}
          {category && (
            <span className="text-base" aria-hidden="true">
              {category.emoji}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onRemove(product.id)}
        className="p-2 text-error/60 hover:text-error transition-colors flex-shrink-0 cursor-pointer"
        aria-label="Ürünü sil"
      >
        <Trash2 className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
