import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Jean Dupont' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name?: string;

  @ApiPropertyOptional({ example: 'jean@yflow.app' })
  @IsOptional()
  @IsEmail({}, { message: 'Adresse email invalide' })
  email?: string;
}
