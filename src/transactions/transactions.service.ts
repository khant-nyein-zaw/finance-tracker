import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from 'src/common/entities/transactions.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Category } from 'src/common/entities/category.entity'
import { apiResponse } from 'src/common/helpers/api-responder'
import { ListAllEntitiesDto } from './dto/list-all-entities.dto'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async findAll(query: ListAllEntitiesDto) {
    const transaction = await this.transactionsRepository
      .createQueryBuilder('transactions')
      .leftJoinAndSelect('transactions.category', 'category')
      .orderBy('transactions.date', 'ASC')
      .skip(query.offset)
      .take(query.limit)
      .getMany()

    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transactions fetched successfully!' }],
      transaction,
    )
  }

  async create(createTransactionDto: CreateTransactionDto) {
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

      return apiResponse(
        HttpStatus.CREATED,
        [
          {
            message: 'Transaction created successfully!',
            property: 'transaction',
          },
        ],
        transaction,
      )
    } catch (err) {
      await queryRunner.rollbackTransaction()
      return apiResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
        {
          message: 'Failed when creating a new transaction!',
          property: 'transaction',
        },
      ])
    } finally {
      await queryRunner.release()
    }
  }

  async findOne(id: number) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['category'],
      select: {
        category: {
          name: true,
        },
      },

    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transaction fetched successfully!' }],
      transaction,
    )
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name: updateTransactionDto.category })
      .getOne()

    const transaction = await this.transactionsRepository.update(id, {
      description: updateTransactionDto.description,
      date: updateTransactionDto.date,
      type: updateTransactionDto.type,
      amount: updateTransactionDto.amount,
      categoryId: category?.id,
    })

    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transaction updated successfully!' }],
      transaction,
    )
  }

  async delete(id: number) {
    const deleteResult = await this.transactionsRepository.delete(id)

    return apiResponse(
      HttpStatus.OK,
      [{ message: 'Transaction deleted successfully!' }],
      deleteResult,
    )
  }
}
