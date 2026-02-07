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
  notes: z.string().max(500).optional(),
});

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
