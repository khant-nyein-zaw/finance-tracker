import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from 'src/common/entities/transactions.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction-dto'
import { Category } from 'src/common/entities/category.entity'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find()
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction | void> {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()

    let category = await queryRunner.manager.findOne(Category, {
      where: { name: createTransactionDto.category },
    })

    await queryRunner.startTransaction()
    try {
      if (!category) {
        category = await queryRunner.manager.save(Category, {
          name: createTransactionDto.category,
        })
      }

      const transaction = await queryRunner.manager.save(Transaction, {
        description: createTransactionDto.description,
        date: createTransactionDto.date,
        type: createTransactionDto.type,
        amount: createTransactionDto.amount,
        categoryId: category.id,
      })

      await queryRunner.commitTransaction()

      return transaction
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  findOne(id: number) {
    return this.transactionsRepository.findOne({ where: { id } })
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const category = await this.categoryRepository.findOne({
      where: { name: updateTransactionDto.category },
    })
    return this.transactionsRepository.update(id, {
      description: updateTransactionDto.description,
      date: updateTransactionDto.date,
      type: updateTransactionDto.type,
      amount: updateTransactionDto.amount,
      categoryId: category?.id,
    })
  }

  delete(id: number) {
    return this.transactionsRepository.delete(id)
  }
}
