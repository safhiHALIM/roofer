'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { api, setAuthToken } from '@/services/api';
import { CartItem } from '@/types';
import { Button } from '@/components/button';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { token, user } = useAuthStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (!user?.emailVerified) {
      router.push('/verify-email');
      return;
    }
    setAuthToken(token);
    setLoading(true);
    api
      .get('/cart')
      .then((res) => setItems(res.data.items || res.data?.items || res.data?.cart?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [token, user, router]);

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0), [items]);

  const updateQuantity = async (productId: string, quantity: number) => {
    const updated = items.map((item) => (item.productId === productId ? { ...item, quantity } : item)).filter((i) => i.quantity > 0);
    setItems(updated);
    setAuthToken(token);
    await api.put('/cart/update', { items: updated });
  };

  const removeItem = async (productId: string) => {
    const updated = items.filter((item) => item.productId !== productId);
    setItems(updated);
    setAuthToken(token);
    await api.delete('/cart/remove', { data: { productId } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panier</h1>
        <span className="text-slate-300">{items.length} articles</span>
      </div>
      {loading ? (
        <p className="text-slate-300">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-400">Votre panier est vide.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover border border-white/10" />
                  )}
                  <div>
                    <p className="font-semibold">{item.name || item.productId}</p>
                    <p className="text-sm text-slate-400">{item.price?.toFixed(2)} €</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button variant="ghost" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                  <Button variant="ghost" onClick={() => removeItem(item.productId)}>
                    Retirer
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="card space-y-3">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-mint">{total.toFixed(2)} €</span>
            </div>
            <Button className="w-full" onClick={() => router.push('/checkout')}>
              Passer la commande (email)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
