"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validators';
import { z } from 'zod';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { api, setAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', data);
      setAuth({ user: res.data.user, token: res.data.token });
      setAuthToken(res.data.token);
      // redirect admins to admin panel, users to account
      if (res.data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <p className="text-slate-300">Réservé aux emails confirmés.</p>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Mot de passe" type="password" {...register('password')} error={errors.password?.message} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <p className="text-center text-sm text-slate-300">
          Pas encore inscrit ? <Link href="/register" className="text-mint">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
