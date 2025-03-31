import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from 'src/common/entities/transactions.entity'
import { Repository } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction-dto'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find()
  }

  async create(createTransactionDto: CreateTransactionDto) {
    // this.transactionsRepository.create()
  }

  findOne(id: number) {
    return this.transactionsRepository.findOne({ where: { id } })
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionsRepository.update(
      id,
      updateTransactionDto,
    )
    return { success: true, transaction }
  }

  delete(id: number) {
    return this.transactionsRepository.delete(id)
  }
}
