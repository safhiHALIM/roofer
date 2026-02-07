'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { api, setAuthToken } from '@/services/api';
import { Button } from '@/components/button';

export default function AccountPage() {
  const { user, token, logout, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    setLoading(true);
    api
      .get('/auth/me')
      .then((res) => setAuth({ user: res.data, token }))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, setAuth, logout]);

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  if (!user) {
    return <p className="text-slate-300">Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Mon compte</h1>
        <p className="text-slate-300">Email {user.emailVerified ? 'vérifié ✅' : 'non vérifié'}.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card space-y-2">
          <p className="text-sm text-slate-400">Nom</p>
          <p className="text-lg font-semibold">{user.name}</p>
        </div>
        <div className="card space-y-2">
          <p className="text-sm text-slate-400">Email</p>
          <p className="text-lg font-semibold">{user.email}</p>
        </div>
        <div className="card space-y-2">
          <p className="text-sm text-slate-400">Rôle</p>
          <p className="text-lg font-semibold">{user.role}</p>
        </div>
        <div className="card space-y-2">
          <p className="text-sm text-slate-400">Créé le</p>
          <p className="text-lg font-semibold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}</p>
        </div>
      </div>
      {!user.emailVerified && (
        <div className="card space-y-2 border-amber-400/50 text-amber-200">
          <p>Vous devez vérifier votre email avant de commander.</p>
          <Button onClick={() => router.push('/verify-email')} variant="ghost">
            Vérifier maintenant
          </Button>
        </div>
      )}
      {loading && <p className="text-slate-400">Actualisation...</p>}
    </div>
  );
}
