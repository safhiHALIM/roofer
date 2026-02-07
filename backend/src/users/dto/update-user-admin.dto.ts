import { IsBoolean, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+().\-\s]{6,20}$/, {
    message: 'Le numéro doit contenir 6 à 20 chiffres ou caractères +().-',
  })
  phone?: string | null;

  @IsOptional()
  @IsEnum(Role, { message: 'role doit être USER ou ADMIN' })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
