'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validators';
import { z } from 'zod';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { api } from '@/services/api';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/auth/register', data);
      setMessage('Compte créé. Vérifiez vos emails pour valider.');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Erreur pendant l'inscription");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <p className="text-slate-300">Vérification email obligatoire avant toute commande.</p>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4">
        <Input label="Nom" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Mot de passe" type="password" {...register('password')} error={errors.password?.message} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Création...' : "S'inscrire"}
        </Button>
        {message && <p className="text-center text-sm text-slate-200">{message}</p>}
        <p className="text-center text-sm text-slate-300">
          Déjà un compte ? <Link href="/login" className="text-mint">Connexion</Link>
        </p>
      </form>
    </div>
  );
}
