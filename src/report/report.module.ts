import { Logger, Module } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportController } from './report.controller'
import { TransactionsService } from 'src/transactions/transactions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/common/entities/transaction.entity'
import { Category } from 'src/common/entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category])],
  controllers: [ReportController],
  providers: [ReportService, TransactionsService, Logger],
  exports: [ReportService],
})
export class ReportModule {}
