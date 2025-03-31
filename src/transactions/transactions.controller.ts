import {
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  Put,
  Delete,
  Body,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction-dto'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  findAll() {
    return this.transactionService.findAll()
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto)
  }

  @Get(':id')
  @HttpCode(200)
  show(@Param('id') id: number) {
    return this.transactionService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.transactionService.delete(id)
  }
}
