import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { FcmModule } from '../fcm/fcm.module'

@Module({
  imports: [FcmModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
