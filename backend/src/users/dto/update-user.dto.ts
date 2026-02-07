import { IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
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
}
