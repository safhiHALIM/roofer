import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().int().positive(),
  name: z.string().optional(),
  price: z.coerce.number().optional(),
  image: z.string().url().optional(),
});

export class AddCartItemDto extends createZodDto(cartItemSchema) {}
