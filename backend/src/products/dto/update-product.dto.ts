import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().uuid().optional(),
  images: z.array(z.string().url()).min(1).optional(),
  price: z.coerce.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export class UpdateProductDto extends createZodDto(updateProductSchema) {}
