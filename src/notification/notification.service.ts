import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: this.configService.get('firebase.client_email'),
        privateKey: this.configService.get('firebase.private_key'),
        projectId: this.configService.get('firebase.project_id'),
      }),
    })
  }

  async sendLowBalanceNotification(userId: number, amount: number) {
    await admin.messaging().send({
      data: {
        title: 'Warning',
        body: `You spent more than you earned this month which is ${amount}`,
      },
      token: 'low_balance',
    })
  }
}
