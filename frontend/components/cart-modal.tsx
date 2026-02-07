"use client";

import { useEffect, useState } from 'react';
import { api, setAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { ShoppingCart, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const CartModal = () => {
  const { token, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) return;
    setAuthToken(token);
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setItems(res.data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && token) fetchCart();
  }, [open, token]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:border-mint/60"
      >
        <ShoppingCart size={18} className="mr-2" />
        Panier
        {items.length > 0 && (
          <span className="ml-2 rounded-full bg-mint px-2 text-xs font-bold text-slate-900">{items.length}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between text-sm text-white">
            <span>Panier rapide</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Chargement...</div>
            ) : items.length === 0 ? (
              <p className="text-slate-400">Panier vide.</p>
            ) : (
              items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                  <div>
                    <p className="font-semibold text-white">{it.name || it.productId}</p>
                    <p className="text-xs text-slate-400">x{it.quantity}</p>
                  </div>
                  <p className="text-mint font-semibold">{((it.price || 0) * it.quantity).toFixed(2)} €</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4">
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="block w-full rounded-xl bg-mint px-3 py-2 text-center text-sm font-semibold text-slate-900 hover:bg-green-500"
            >
              Voir le panier
            </Link>
          </div>
          {!user && <p className="mt-2 text-xs text-amber-300">Connexion requise pour voir le panier.</p>}
        </div>
      )}
    </div>
  );
};
