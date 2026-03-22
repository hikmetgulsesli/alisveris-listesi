'use client';

import { ShoppingCart, ShoppingBasket } from 'lucide-react';

interface EmptyStateProps {
  onAddFirst?: () => void;
}

export default function EmptyState({ onAddFirst }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-8 pb-12 text-center">
      {/* Hero Empty Visual */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[#ff7a2c]/10 blur-3xl rounded-full scale-150" />
        <div className="relative bg-[var(--color-surface-container-lowest)] dark:bg-inverse-surface w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl shadow-[#9b3f00]/5">
          <ShoppingBasket
            className="text-[var(--color-primary-container)] animate-bounce"
            size={64}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Typography Content */}
      <div className="max-w-xs mx-auto">
        <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-3 tracking-tight">
          Alışveriş listeniz boş
        </h2>
        <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-sm mb-10">
          Alışverişe başlamak için ürün ekleyin ve sepetinizi doldurun.
        </p>
      </div>

      {/* Call to Action */}
      <button
        onClick={onAddFirst}
        className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#9b3f00]/20 active:scale-95 transition-all duration-200 flex items-center gap-3"
      >
        <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
        İlk Ürün Ekle
      </button>
    </div>
  );
}
