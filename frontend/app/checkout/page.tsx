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
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    notes: '',
  });
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
    setContact((prev) => ({
      ...prev,
      name: user?.name || '',
      phone: user?.phone || '',
    }));
  }, [token, user, router]);

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0), [items]);

  const handleSubmit = async () => {
    if (!contact.name.trim()) {
      setError('Votre nom est requis.');
      return;
    }
    if (!contact.address.trim() || !contact.city.trim() || !contact.zip.trim()) {
      setError('Adresse, ville et code postal sont requis.');
      return;
    }
    setError(null);
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/orders', {
        items,
        total,
        contactName: contact.name.trim(),
        contactPhone: contact.phone.trim() || undefined,
        contactAddress: contact.address.trim(),
        contactCity: contact.city.trim(),
        contactZip: contact.zip.trim(),
        notes: contact.notes.trim() || undefined,
      });
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

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card space-y-3">
          <p className="text-sm text-slate-300">Informations de contact et livraison</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-slate-200">Nom complet *</span>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                value={contact.name}
                onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-200">Téléphone</span>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-slate-200">Adresse *</span>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                value={contact.address}
                onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-200">Ville *</span>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                value={contact.city}
                onChange={(e) => setContact((c) => ({ ...c, city: e.target.value }))}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-200">Code postal *</span>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                value={contact.zip}
                onChange={(e) => setContact((c) => ({ ...c, zip: e.target.value }))}
                required
              />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-slate-200">Notes pour la commande</span>
              <textarea
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                rows={3}
                value={contact.notes}
                onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
              />
            </label>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

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
    </div>
  );
}
