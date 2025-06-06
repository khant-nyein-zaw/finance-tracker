import { Logger, Module } from '@nestjs/common'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/common/entities/transaction.entity'
import { DatabaseModule } from 'src/db/db.module'
import { Category } from 'src/common/entities/category.entity'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Transaction, Category])],
  controllers: [TransactionsController],
  providers: [TransactionsService, Logger],
})
export class TransactionsModule {}
