"use client";

import { useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { Product, Category } from '@/types';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

export default function AdminProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    Promise.all([
      api.get('/admin/products').then((r) => setProducts(r.data)),
      api.get('/categories').then((r) => setCategories(r.data)),
    ]).catch(() => setMessage('Erreur de chargement'));
  }, [token]);

  const resetForm = () => setForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '' });

  const handleCreate = async () => {
    if (!token) return;
    if (!categories.length) {
      setMessage('Créez d’abord une catégorie.');
      return;
    }
    if (!form.categoryId) {
      setForm((f) => ({ ...f, categoryId: categories[0].id }));
    }
    if (!form.name.trim() || form.name.trim().length < 2) {
      setMessage('Nom trop court (min 2 caractères).');
      return;
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      setMessage('Description trop courte (min 10 caractères).');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setMessage('Prix invalide.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/admin/products', {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId,
        images: form.imageUrl
          ? [form.imageUrl]
          : ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'],
      });
      setProducts((p) => [res.data, ...p]);
      resetForm();
      setMessage('Produit créé');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Erreur création');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await api.put(`/admin/products/${id}`, { isActive: !isActive });
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, isActive: !isActive } : p)));
  };

  const deleteProduct = async (id: string) => {
    await api.delete(`/admin/products/${id}`);
    setProducts((list) => list.filter((p) => p.id !== id));
  };

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold text-white">Créer un produit</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input
            label="Prix (€)"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
          <select
            className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          >
            <option value="">Catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="text-slate-900">
                {c.name}
              </option>
            ))}
          </select>
          <Input
            label="Image URL"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? '...' : 'Créer'}
          </Button>
          {message && <span className="text-sm text-slate-200">{message}</span>}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Produits</h2>
          <span className="text-xs text-slate-400">{products.length} produits</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm text-slate-100">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2">Nom</th>
                <th className="py-2">Catégorie</th>
                <th className="py-2">Prix</th>
                <th className="py-2">Actif</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 pr-3 font-semibold">{p.name}</td>
                  <td className="py-2 pr-3 text-slate-300">{catMap[p.categoryId] || '-'}</td>
                  <td className="py-2 pr-3">{p.price.toFixed(2)} €</td>
                  <td className="py-2 pr-3">{p.isActive ? 'Oui' : 'Non'}</td>
                  <td className="py-2 flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => toggleActive(p.id, p.isActive)}>
                      {p.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button variant="ghost" onClick={() => deleteProduct(p.id)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
