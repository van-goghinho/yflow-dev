import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty({ example: 'Mon workflow' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Définition du workflow (nodes/edges ReactFlow ou inputs)' })
  @IsObject()
  definition: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'IA' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'resume-ia' })
  @IsOptional()
  @IsString()
  webhookPath?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
