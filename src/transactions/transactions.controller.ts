import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  HttpCode,
  Put,
  Delete,
  Request,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { Transaction } from './interfaces/transactions.interface'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  index(): Transaction[] {
    return this.transactionService.index()
  }

  @Post()
  create(@Req() request: Request): Transaction[] {
    const { name, type, amount, reason }: any = request.body
    return this.transactionService.create({ name, type, amount, reason })
  }

  @Get(':id')
  @HttpCode(200)
  show(@Param('id') id: string) {
    return `Transaction #${id} was shown`
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `Transaction #${id} was updated`
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return `Transaction #${id} was deleted`
  }
}
