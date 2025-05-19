import { Injectable, Logger } from '@nestjs/common'
import { FcmService } from '../fcm/fcm.service'

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)
  constructor(private readonly fcmService: FcmService) {}

  async sendLowBalanceNotification(
    userId: number,
    email: string,
    income: number,
    expenses: number,
    fcmToken?: string,
  ) {
    this.logger.warn(
      `Sending low balance notification to user ${userId} (${email}): ` +
        `Income: ${income}, Expenses: ${expenses}. You spent more than you earned this month!`,
    )

    if (fcmToken) {
      try {
        await this.fcmService.sendPushNotification({
          token: fcmToken,
          notification: {
            title: 'Monthly Spending Alert!',
            body: `Your expenses ($${expenses}) were higher than your income ($${income}) this month. Net: $${income - expenses}`,
          },
          data: {
            type: 'low_balance_alert',
            userId: userId.toString(),
            income: income.toString(),
            expenses: expenses.toString(),
          },
        })
        this.logger.log(`FCM low balance alert sent to ${email}`)
      } catch (error) {
        this.logger.error(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Failed to send FCM low balance alert to ${email}: ${error.message}`,
        )
      }
    }
  }
}
