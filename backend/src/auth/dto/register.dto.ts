import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long'),
  name: z.string().min(2),
  phone: z.string().min(6).max(20).optional(),
});

export class RegisterDto extends createZodDto(registerSchema) {}
