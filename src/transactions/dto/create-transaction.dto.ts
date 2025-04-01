import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator'
import { TransactionType } from 'src/common/enums/transaction-type.enum'

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  description: string

  @IsString()
  date: string

  @IsString()
  @IsEnum(TransactionType)
  type: string

  @IsNumber()
  amount: number

  @IsString()
  @IsNotEmpty()
  category: string
}
