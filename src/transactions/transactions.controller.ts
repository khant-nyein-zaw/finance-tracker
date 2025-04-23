import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { ListAllEntitiesDto } from './dto/list-all-entities.dto'
import { HttpCodeInterceptor } from 'src/common/interceptors/http-code.interceptor'

@Controller('transactions')
@UseInterceptors(HttpCodeInterceptor)
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  async findAll(@Query() query: ListAllEntitiesDto) {
    const transactions = await this.transactionService.findAll(query)

    return {
      message: 'Transactions fetched successfully!',
      data: transactions,
    }
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const result = await this.transactionService.create(createTransactionDto)

    return {
      message: 'Transaction created successfully!',
      data: result,
    }
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const transaction = await this.transactionService.findOne(+id)
    return {
      message: 'Transaction fetched successfully!',
      data: transaction,
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const result = await this.transactionService.update(
      +id,
      updateTransactionDto,
    )

    return {
      message: 'Transaction updated successfully!',
      data: result,
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.transactionService.delete(+id)
    return {
      message: 'Transaction deleted successfully!',
      data: result,
    }
  }
}
