import { Injectable } from '@nestjs/common'
import { TransactionType } from 'src/common/enums/transaction-type.enum'
import { TransactionsService } from 'src/transactions/transactions.service'
import { GetReportDto } from './dto/get-report.dto'

@Injectable()
export class ReportService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async getIncomeVsExpense(userId: number, getReportDto: GetReportDto) {
    const totalIncome = await this.transactionsService.sumTransactionByType(
      userId,
      TransactionType.INCOME,
      getReportDto.startDate,
      getReportDto.endDate,
    )

    const totalExpense = await this.transactionsService.sumTransactionByType(
      userId,
      TransactionType.EXPENSE,
      getReportDto.startDate,
      getReportDto.endDate,
    )

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    }
  }

  async getSpendingByCategory(userId: number, getReportDto: GetReportDto) {
    return await this.transactionsService.groupTransactionsByCategory(
      userId,
      TransactionType.EXPENSE,
      getReportDto.startDate,
      getReportDto.endDate,
    )
  }
}
