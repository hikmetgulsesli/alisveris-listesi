'use client';

import { useRef, useState } from 'react';
import { Trash2, CheckCircle2, Menu, UserCircle, LayoutList, Tag, ShoppingBasket, User } from 'lucide-react';
import { useShoppingList } from '@/hooks/useShoppingList';
import { categories } from '@/lib/categories';
import ProductForm from './ProductForm';
import CategoryGroup from './CategoryGroup';
import EmptyState from './EmptyState';

export default function ShoppingList() {
  const { products, addProduct, removeProduct, toggleProduct, updateProduct, clearChecked, clearAll } = useShoppingList();
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleAddFirst = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-[var(--color-surface)]/80 backdrop-blur-md flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors text-[var(--color-primary)] active:scale-95 duration-200">
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <h1 className="font-semibold text-xl tracking-tight text-[var(--color-primary)]">Alışveriş Listem</h1>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors text-[var(--color-primary)] active:scale-95 duration-200">
          <UserCircle className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-8 pt-16 pb-24">
        <ProductForm ref={inputRef} onAdd={addProduct} />

        {products.length === 0 ? (
          <EmptyState onAddFirst={handleAddFirst} />
        ) : (
          <>
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

            {hasChecked && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--color-outline-variant)]/15">
                <button
                  onClick={clearChecked}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] font-semibold rounded-xl hover:bg-[var(--color-surface-container-high)] transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
                  <span>İşaretlileri Temizle ({checkedCount})</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className={`flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-xl transition-colors ${
                    showClearAllConfirm
                      ? 'bg-[var(--color-error)] text-white'
                      : 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] hover:bg-[var(--color-error)] hover:text-white'
                  }`}
                >
                  <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                  <span>{showClearAllConfirm ? 'Onayla!' : 'Tümünü Sil'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[var(--color-surface)]/85 backdrop-blur-xl rounded-t-3xl border-t border-white/10 shadow-[0_-8px_24px_rgba(46,47,47,0.06)]">
        <a href="#" className="flex flex-col items-center justify-center text-[var(--color-primary)] bg-[var(--color-primary-container)]/10 rounded-2xl px-4 py-1 scale-110 transition-transform duration-300 ease-out">
          <LayoutList className="w-6 h-6" strokeWidth={1.5} style={{ fill: 'currentColor' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Listelerim</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
          <Tag className="w-6 h-6" strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Kampanyalar</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
          <ShoppingBasket className="w-6 h-6" strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Sepetim</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
          <User className="w-6 h-6" strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Profil</span>
        </a>
      </nav>
    </div>
  );
}
