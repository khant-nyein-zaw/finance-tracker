import {
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  Put,
  Delete,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { ListAllEntitiesDto } from './dto/list-all-entities.dto'
import { apiResponse } from 'src/common/helpers/api-responder'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  async findAll(@Query() query: ListAllEntitiesDto) {
    const transactions = await this.transactionService.findAll(query)
    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transactions fetched successfully!' }],
      transactions,
    )
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const result = await this.transactionService.create(createTransactionDto)

    return apiResponse(
      HttpStatus.CREATED,
      [
        {
          message: 'Transaction created successfully!',
          property: 'transaction',
        },
      ],
      result,
    )
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const transaction = await this.transactionService.findOne(+id)
    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transaction fetched successfully!' }],
      transaction,
    )
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

    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transaction updated successfully!' }],
      result,
    )
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.transactionService.delete(+id)
    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transaction deleted successfully!' }],
      result,
    )
  }
}
