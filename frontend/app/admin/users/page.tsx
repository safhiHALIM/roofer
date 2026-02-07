"use client";

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { ShieldCheck, ShieldOff, RefreshCw, UserCog, Crown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { api, setAuthToken } from '@/services/api';
import { User } from '@/types';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

export default function AdminUsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedUser = useMemo(() => users.find((u) => u.id === selectedId) || null, [selectedId, users]);

  const loadUsers = async () => {
    if (!token) return;
    setAuthToken(token);
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      if (!selectedId && res.data.length) setSelectedId(res.data[0].id);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  useEffect(() => {
    if (selectedUser) {
      setForm({ name: selectedUser.name ?? '', phone: selectedUser.phone ?? '' });
    }
  }, [selectedUser]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return users;
    const f = filter.toLowerCase();
    return users.filter((u) => u.email.toLowerCase().includes(f) || (u.name || '').toLowerCase().includes(f));
  }, [users, filter]);

  const patchUser = async (id: string, payload: Partial<User>) => {
    if (!token) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    setAuthToken(token);
    try {
      const res = await api.patch(`/users/${id}`, payload);
      setUsers((list) => list.map((u) => (u.id === id ? res.data : u)));
      if (selectedId === id) {
        setForm({ name: res.data.name ?? '', phone: res.data.phone ?? '' });
      }
      setMessage('Modifications enregistrées');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Échec de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (user: User) => {
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    patchUser(user.id, { role: nextRole });
  };

  const toggleVerification = (user: User) => {
    patchUser(user.id, { emailVerified: !user.emailVerified });
  };

  const saveProfile = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!selectedUser) return;
    patchUser(selectedUser.id, { name: form.name, phone: form.phone || null });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-mint">Panel</p>
          <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
          <p className="text-sm text-slate-400">Rôles, vérification email et coordonnées.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher (email, nom)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-64"
          />
          <Button variant="ghost" onClick={loadUsers} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-300">
              {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}
            </p>
            {error && <span className="text-sm text-red-400">{error}</span>}
            {message && <span className="text-sm text-emerald-300">{message}</span>}
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm text-slate-100">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="py-2">Email</th>
                  <th className="py-2">Nom</th>
                  <th className="py-2">Rôle</th>
                  <th className="py-2">Vérifié</th>
                  <th className="py-2">Inscription</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className={`cursor-pointer transition hover:bg-white/5 ${selectedId === u.id ? 'bg-white/5' : ''}`}
                    onClick={() => setSelectedId(u.id)}
                  >
                    <td className="py-2 pr-3 font-semibold">{u.email}</td>
                    <td className="py-2 pr-3 text-slate-200">{u.name}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-400/15 text-amber-200 border border-amber-300/30'
                            : 'bg-white/5 text-slate-200 border border-white/10'
                        }`}
                      >
                        {u.role === 'ADMIN' ? <Crown size={14} /> : <UserCog size={14} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                          u.emailVerified
                            ? 'border border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
                            : 'border border-red-300/30 bg-red-400/10 text-red-200'
                        }`}
                      >
                        {u.emailVerified ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-slate-300">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            toggleRole(u);
                          }}
                          disabled={saving}
                        >
                          {u.role === 'ADMIN' ? 'Rétrograder' : 'Promouvoir'}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            toggleVerification(u);
                          }}
                          disabled={saving}
                        >
                          {u.emailVerified ? 'Marquer non vérifié' : 'Valider email'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p className="mt-3 text-sm text-slate-400">Chargement...</p>}
            {!loading && filtered.length === 0 && <p className="mt-3 text-sm text-slate-400">Aucun utilisateur.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Profil</p>
              <h2 className="text-lg font-semibold text-white">Modifier les infos</h2>
            </div>
            <ShieldCheck size={18} className="text-mint" />
          </div>
          {selectedUser ? (
            <form className="space-y-4" onSubmit={saveProfile}>
              <Input
                label="Nom complet"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <Input
                label="Téléphone"
                placeholder="+33 6 12 34 56 78"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? '...' : 'Enregistrer'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setForm({ name: selectedUser.name ?? '', phone: selectedUser.phone ?? '' })}
                >
                  Réinitialiser
                </Button>
              </div>
              <div className="text-xs text-slate-400">
                <p>Email : {selectedUser.email}</p>
                <p>Rôle : {selectedUser.role}</p>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldOff size={16} />
              <p>Sélectionnez un utilisateur dans la liste.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
