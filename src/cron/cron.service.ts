import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationService } from '../notification/notification.service'
import { UsersService } from '../users/users.service'
import { ReportService } from '../report/report.service'

@Injectable()
export class CronService {
  constructor(
    // private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly reportService: ReportService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    name: 'monthlyFinancialReview',
    timeZone: 'Asia/Yangon',
  })
  async handleMonthlyFinancialReview() {
    const users = await this.usersService.findAll()

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0, 23, 59, 59)

    for (const user of users) {
      const { totalIncome, totalExpense, balance } =
        await this.reportService.getIncomeVsExpense(user.id, {
          startDate,
          endDate,
        })
      if (balance < 0) {
        await this.notificationService.sendLowBalanceNotification(
          user.id,
          user.email,
          totalIncome,
          totalExpense,
        )
      }
    }
  }
}
