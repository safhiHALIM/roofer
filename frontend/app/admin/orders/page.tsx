"use client";

import { useEffect, useState } from 'react';
import { api, setAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { Order } from '@/types';
import { Button } from '@/components/button';

const statuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    api
      .get('/admin/orders')
      .then((r) => setOrders(r.data))
      .catch(() => setMessage('Erreur de chargement'));
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
      setMessage('Statut mis à jour');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Erreur statut');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Commandes</h2>
        <span className="text-xs text-slate-400">{orders.length} commandes</span>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Commande #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-slate-400">Total: {order.total.toFixed(2)} €</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="rounded-lg border border-white/10 bg-slate-800 px-2 py-1 text-sm text-white"
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="text-slate-900">
                      {s}
                    </option>
                  ))}
                </select>
                <Button variant="ghost" onClick={() => updateStatus(order.id, order.status)}>
                  Mettre à jour
                </Button>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-300">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                <ul className="space-y-1">
                  {order.items.map((it: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{it.name || it.productId}</span>
                      <span>
                        x{it.quantity} — {(it.price || 0).toFixed(2)} €
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun article</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-sm text-slate-200">{message}</p>}
    </div>
  );
}
