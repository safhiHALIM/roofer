import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const removeCartItemSchema = z.object({
  productId: z.string(),
});

export class RemoveCartItemDto extends createZodDto(removeCartItemSchema) {}
