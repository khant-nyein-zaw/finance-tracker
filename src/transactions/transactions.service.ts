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
    return await this.transactionsRepository
      .createQueryBuilder('transactions')
      .leftJoinAndSelect('transactions.category', 'category')
      .orderBy('transactions.date', 'ASC')
      .skip(query.offset)
      .take(query.limit)
      .getMany()
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    return await this.transactionsRepository.findOne({
      where: { id },
      relations: ['category'],
      select: {
        category: {
          name: true,
        },
      },
    })
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const existingCategory = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name: updateTransactionDto.category })
      .getOne()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, ...transactionData } = updateTransactionDto
    const data = { ...transactionData, categoryId: existingCategory?.id }

    return await this.transactionsRepository.update(id, data)
  }

  async delete(id: number) {
    return await this.transactionsRepository.delete(id)
  }

  async sumTransactionByType(
    userId: number,
    type: TransactionType,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select(`SUM(transaction.amount) as totalAmount`)
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.date >= :startDate', { startDate })
      .andWhere('transaction.date <= :endDate', { endDate })
      .andWhere('transaction.type = :type', { type })
      .getRawOne()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return parseFloat(<string>result.totalAmount || '0')
  }

  async groupTransactionsByCategory(
    userId: number,
    type: TransactionType,
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('transaction.category_id', 'categoryId')
      .addSelect('category.name', 'category')
      .addSelect('SUM(transaction.amount)', 'total')
      .leftJoin('transaction.category', 'category')
      .where('transaction.type = :type', { type })
      .andWhere('transaction.userId = :userId', { userId })
      .andWhere('transaction.date >= :startDate', { startDate })
      .andWhere('transaction.date <= :endDate', { endDate })
      .groupBy('categoryId')
      .getRawMany()

    return result.map((row) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      amount: parseFloat(<string>row.total || '0'),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      category: row.category,
    }))
  }
}
