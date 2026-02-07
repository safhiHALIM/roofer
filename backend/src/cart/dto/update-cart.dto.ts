import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { cartItemSchema } from './add-cart-item.dto';

export const updateCartSchema = z.object({
  items: z.array(cartItemSchema),
});

export class UpdateCartDto extends createZodDto(updateCartSchema) {}
