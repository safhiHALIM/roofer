import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
});

export const checkoutSchema = z.object({
  notes: z.string().max(500).optional(),
});
