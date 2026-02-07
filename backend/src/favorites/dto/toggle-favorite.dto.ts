import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const toggleFavoriteSchema = z.object({
  productId: z.string(),
});

export class ToggleFavoriteDto extends createZodDto(toggleFavoriteSchema) {}
