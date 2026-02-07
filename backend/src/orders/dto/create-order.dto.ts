import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative().optional(),
  name: z.string().optional(),
  image: z.string().url().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  total: z.coerce.number().positive(),
  contactName: z.string().min(1).max(191),
  contactPhone: z.string().min(3).max(50).optional(),
  contactAddress: z.string().min(3).max(191).optional(),
  contactCity: z.string().min(2).max(191).optional(),
  contactZip: z.string().min(2).max(20).optional(),
  notes: z.string().max(500).optional(),
});

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
