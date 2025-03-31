import { IsString, IsDate, IsNumber } from 'class-validator'

export class CreateTransactionDto {
  @IsString()
  description: string

  @IsString()
  date: string

  @IsString()
  type: string

  @IsNumber()
  amount: number

  @IsString()
  user: string
}
