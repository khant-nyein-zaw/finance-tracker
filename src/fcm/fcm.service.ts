import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'
import { TokenMessage } from 'firebase-admin/messaging'

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name)
  private isInitialized = false

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): any {
    if (!admin.apps.length) {
      try {
        if (this.configService.getOrThrow('firebase.key')) {
          const serviceAccount = JSON.parse(
            this.configService.get('firebase.key') as string,
          ) as object
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          })
          this.logger.log('Firebase admin SDK initialized')
          this.isInitialized = true
        }
      } catch (error) {
        this.logger.error('Failed to initialize Firebase admin SDK', error)
      }
    } else {
      this.isInitialized = true
    }
  }

  async sendPushNotification(message: TokenMessage) {
    if (!this.isInitialized) {
      this.logger.error(
        'FCM Service not initialized. Cannot send notification.',
      )
      throw new Error('FCM Service not initialized.')
    }

    try {
      const response = await admin.messaging().send(message)
      this.logger.log(`FCM Service sent notification: `, response)
      return JSON.parse(response) as object
    } catch (e) {
      this.logger.error('Error sending notification')
      throw e
    }
  }
}
