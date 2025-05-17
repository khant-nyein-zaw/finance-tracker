import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationService } from '../notification/notification.service'
import { UsersService } from '../users/users.service'
import { ReportService } from '../report/report.service'

@Injectable()
export class TaskService {
  constructor(
    // private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly reportService: ReportService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'monthlyFinancialReview',
    timeZone: 'Asia/Yangon',
  })
  async handleMonthlyFinancialReview() {
    const users = await this.usersService.findAll()

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    for (const user of users) {
      const { balance } = await this.reportService.getIncomeVsExpense(user.id, {
        startDate,
        endDate,
      })
      if (balance < 0) {
        await this.notificationService.sendLowBalanceNotification(
          user.id,
          balance,
        )
      }
    }
  }
}
