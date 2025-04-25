import { Injectable } from '@nestjs/common'
import { TransactionType } from 'src/common/enums/transaction-type.enum'
import { TransactionsService } from 'src/transactions/transactions.service'

@Injectable()
export class ReportService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async getIncomeVsExpense(userId: number, startDate: string, endDate: string) {
    const totalIncome = await this.transactionsService.sumTransactionByType(
      userId,
      TransactionType.INCOME,
      startDate,
      endDate,
    )

    const totalExpense = await this.transactionsService.sumTransactionByType(
      userId,
      TransactionType.EXPENSE,
      startDate,
      endDate,
    )

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    }
  }

  async getSpendingByCategory(
    userId: number,
    startDate: string,
    endDate: string,
  ) {
    const spendingByCategory =
      await this.transactionsService.groupTransactionsByCategory(
        userId,
        TransactionType.EXPENSE,
        startDate,
        endDate,
      )

    return spendingByCategory
  }
}
