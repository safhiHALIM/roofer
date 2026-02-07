"use client";

import { useEffect, useState } from 'react';
import { api, setAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { Category } from '@/types';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

export default function AdminCategoriesPage() {
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => setMessage('Erreur de chargement'));
  }, [token]);

  const handleCreate = async () => {
    if (!token) return;
    try {
      const res = await api.post('/admin/categories', { ...form });
      setCategories((c) => [res.data, ...c]);
      setForm({ name: '', slug: '' });
      setMessage('Catégorie créée');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Erreur création');
    }
  };

  const deleteCategory = async (id: string) => {
    await api.delete(`/admin/categories/${id}`);
    setCategories((c) => c.filter((cat) => cat.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold text-white">Créer une catégorie</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Slug (optionnel)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <div className="flex items-end">
            <Button onClick={handleCreate}>Créer</Button>
          </div>
        </div>
        {message && <p className="mt-2 text-sm text-slate-200">{message}</p>}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Catégories</h2>
          <span className="text-xs text-slate-400">{categories.length} catégories</span>
        </div>
        <div className="mt-4 space-y-2 text-slate-100">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/60 px-4 py-2">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-slate-400">{c.slug}</p>
              </div>
              <Button variant="ghost" onClick={() => deleteCategory(c.id)}>
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
