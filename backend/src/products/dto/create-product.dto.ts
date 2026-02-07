import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  categoryId: z.string().uuid(),
  images: z.array(z.string().url()).min(1),
  price: z.coerce.number().positive(),
  isActive: z.boolean().optional(),
});

export class CreateProductDto extends createZodDto(createProductSchema) {}
