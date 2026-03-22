'use client';

import { useState } from 'react';
import { Trash2, CheckCircle2, ShoppingCart, Store } from 'lucide-react';
import { useShoppingList } from '@/hooks/useShoppingList';
import { categories } from '@/lib/categories';
import ProductForm from './ProductForm';
import CategoryGroup from './CategoryGroup';
import EmptyState from './EmptyState';

export default function ShoppingList() {
  const { products, addProduct, removeProduct, toggleProduct, updateProduct, clearChecked, clearAll } = useShoppingList();
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const groupedProducts = categories.reduce((acc, cat) => {
    const catProducts = products
      .filter((p) => p.category === cat.id)
      .sort((a, b) => {
        if (a.checked !== b.checked) return a.checked ? 1 : -1;
        return b.createdAt - a.createdAt;
      });
    if (catProducts.length > 0) {
      acc[cat.id] = catProducts;
    }
    return acc;
  }, {} as Record<string, typeof products>);

  const checkedCount = products.filter((p) => p.checked).length;
  const hasChecked = checkedCount > 0;

  const handleClearAll = () => {
    if (showClearAllConfirm) {
      clearAll();
      setShowClearAllConfirm(false);
    } else {
      setShowClearAllConfirm(true);
      setTimeout(() => setShowClearAllConfirm(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <h1 className="font-semibold text-xl tracking-tight text-primary">Haftalık Market</h1>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Sepetim"
          >
            <ShoppingCart className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8 pb-32">
        {/* Product Form */}
        <ProductForm onAdd={addProduct} />

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Category Groups */}
            <div className="space-y-10">
              {Object.entries(groupedProducts).map(([catId, catProducts]) => (
                <CategoryGroup
                  key={catId}
                  categoryId={catId}
                  products={catProducts}
                  onToggle={toggleProduct}
                  onRemove={removeProduct}
                  onUpdate={updateProduct}
                />
              ))}
            </div>

            {/* Action Buttons */}
            {hasChecked && (
              <div className="flex flex-col gap-3 py-6">
                <button
                  onClick={clearChecked}
                  className="w-full h-12 flex items-center justify-center gap-2 border-2 border-surface-container-high bg-surface-container-low rounded-xl text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
                  <span>İşaretlileri Temizle ({checkedCount})</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    showClearAllConfirm
                      ? 'bg-error text-on-error'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-2 border-surface-container-high'
                  }`}
                >
                  <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                  <span>{showClearAllConfirm ? 'Onayla — Tümünü Sil!' : 'Tümünü Sil'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 pb-safe">
        <div className="flex justify-around items-center h-20 px-4 w-full max-w-2xl mx-auto bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant">
          <button className="flex flex-col items-center justify-center gap-1 text-primary cursor-pointer">
            <Store className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">Listelerim</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">Sepetim</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <Trash2 className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">Silinenler</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">Ayarlar</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
