import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'completed', 'cancelled']),
});

export class UpdateStatusDto extends createZodDto(updateStatusSchema) {}
