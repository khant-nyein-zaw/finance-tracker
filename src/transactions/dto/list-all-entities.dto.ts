// list-all-entities.dto.ts
import { IsOptional, IsNumber, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ListAllEntitiesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC'
}
