import { Type } from 'class-transformer'
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator'
import { TransactionType } from 'src/common/enums/transaction-type.enum'

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  description: string

  @IsDate()
  @Type(() => Date)
  date: string

  @IsString()
  @IsEnum(TransactionType)
  type: string

  @IsNumber()
  amount: number

  @IsString()
  @IsNotEmpty()
  category: string

  @IsNumber()
  userId: number
}
