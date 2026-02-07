import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
});

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}
