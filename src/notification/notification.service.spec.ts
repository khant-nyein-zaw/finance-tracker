import { Test, TestingModule } from '@nestjs/testing'
import { NotificationService } from './notification.service'
import { FcmService } from '../fcm/fcm.service'
import { ConfigService } from '@nestjs/config'

describe('NotificationService', () => {
  let service: NotificationService
  let fcmService: FcmService // Declare the mockable service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        ConfigService,
        {
          // Provide a mock implementation for FcmService
          provide: FcmService,
          useValue: {
            sendPushNotification: jest.fn(), // Mock the actual sending method
          },
        },
      ],
    }).compile()

    service = module.get<NotificationService>(NotificationService)
    fcmService = module.get<FcmService>(FcmService) // Get the mock instance
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should attempt to send FCM low balance notification if token is provided', async () => {
    const userId = 1
    const email = 'test@example.com'
    const income = 500
    const expenses = 1000
    const fcmToken = 'mock_fcm_token_123'

    await service.sendLowBalanceNotification(
      userId,
      email,
      income,
      expenses,
      fcmToken,
    )

    // Assert that the mock FCM service's method was called with the correct arguments
    expect(fcmService.sendPushNotification).toHaveBeenCalledTimes(1)
    expect(fcmService.sendPushNotification).toHaveBeenCalledWith({
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
  })

  it('should not attempt to send FCM notification if no token is provided', async () => {
    const userId = 2
    const email = 'no_token@example.com'
    const income = 2000
    const expenses = 1500

    await service.sendLowBalanceNotification(
      userId,
      email,
      income,
      expenses,
      undefined,
    )

    // Assert that the mock FCM service's method was NOT called
    expect(fcmService.sendPushNotification).not.toHaveBeenCalled()
  })
})
