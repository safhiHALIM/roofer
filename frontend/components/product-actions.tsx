'use client';

import { useRouter } from 'next/navigation';
import { Button } from './button';
import { useAuthStore } from '@/stores/authStore';
import { api, setAuthToken } from '@/services/api';
import { Product } from '@/types';
import { useState } from 'react';

export const AddToCartButton = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (!user?.emailVerified) {
      router.push('/verify-email');
      return;
    }
    setLoading(true);
    try {
      setAuthToken(token);
      await api.post('/cart/add', {
        productId: product.id,
        quantity: 1,
        price: product.price,
        name: product.name,
      });
      router.push('/cart');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleAdd} disabled={loading}>
      {loading ? 'Ajout...' : 'Ajouter au panier'}
    </Button>
  );
};
