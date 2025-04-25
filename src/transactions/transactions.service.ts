import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from 'src/common/entities/transaction.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Category } from 'src/common/entities/category.entity'
import { ListAllEntitiesDto } from './dto/list-all-entities.dto'
import { TransactionType } from 'src/common/enums/transaction-type.enum'

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
    /*
     * @todo
     * need to re-check the pagination process works properly or not
     */
    const transaction = await this.transactionsRepository
      .createQueryBuilder('transactions')
      .leftJoinAndSelect('transactions.category', 'category')
      .orderBy('transactions.date', 'ASC')
      .skip(query.offset)
      .take(query.limit)
      .getMany()

    return transaction
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()

    let existingCategory = await queryRunner.manager.findOne(Category, {
      where: { name: createTransactionDto.category },
    })

    await queryRunner.startTransaction()
    try {
      if (!existingCategory) {
        existingCategory = await queryRunner.manager.save(Category, {
          name: createTransactionDto.category,
        })
      }

      const { category, ...transactionData } = createTransactionDto
      const data = { ...transactionData, categoryId: existingCategory.id }

      const transaction = await queryRunner.manager.save(Transaction, data)

      await queryRunner.commitTransaction()

      return transaction
    } catch {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException()
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
    })

    return transaction
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const existingCategory = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name: updateTransactionDto.category })
      .getOne()

    const { category, ...transactionData } = updateTransactionDto
    const data = { ...transactionData, categoryId: existingCategory?.id }

    const transaction = await this.transactionsRepository.update(id, data)

    return transaction
  }

  async delete(id: number) {
    const deleteResult = await this.transactionsRepository.delete(id)

    return deleteResult
  }

  async sumTransactionByType(
    userId: number,
    type: TransactionType,
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select(`SUM(transaction.amount) as totalAmount`)
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.date >= :startDate', { startDate })
      .andWhere('transaction.date <= :endDate', { endDate })
      .andWhere('transaction.type = :type', { type })
      .getRawOne()

    return parseFloat(result?.totalAmount || 0)
  }

  async groupTransactionsByCategory(
    userId: number,
    type: TransactionType,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('transaction.amount', 'totalAmount')
      .leftJoin('transaction.category', 'category')
      .where('transaction.type = :type', { type })
      .andWhere('transaction.userId = :userId', { userId })
      .andWhere('transaction.date <= :startDate', { startDate })
      .andWhere('transaction.date <= :endDate', { endDate })
      .groupBy('category.id')
      .getRawMany()

    return result
  }
}
