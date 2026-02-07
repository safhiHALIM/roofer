import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
});

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}
