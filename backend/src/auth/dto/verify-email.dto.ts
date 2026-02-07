import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const verifySchema = z.object({
  token: z.string().min(10),
});

export class VerifyEmailDto extends createZodDto(verifySchema) {}
