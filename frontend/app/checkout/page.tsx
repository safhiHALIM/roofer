'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { api, setAuthToken } from '@/services/api';
import { CartItem } from '@/types';
import { Button } from '@/components/button';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { token, user } = useAuthStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
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
    api
      .get('/cart')
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]));
  }, [token, user, router]);

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0), [items]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/orders', { items, total });
      setMessage('Commande envoyée. Vous recevrez un email de confirmation.');
      router.push('/account');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Impossible de créer la commande');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <p className="text-slate-300">Votre panier est vide.</p>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Validation (email)</h1>
      <div className="card space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span>{item.name}</span>
            <span className="text-slate-300">x {item.quantity}</span>
            <span className="text-mint">{((item.price || 0) * item.quantity).toFixed(2)} €</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-mint">{total.toFixed(2)} €</span>
        </div>
        <Button className="w-full" disabled={loading} onClick={handleSubmit}>
          {loading ? 'Envoi...' : 'Confirmer la commande par email'}
        </Button>
        {message && <p className="text-center text-sm text-slate-200">{message}</p>}
      </div>
    </div>
  );
}
