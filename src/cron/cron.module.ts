import { Logger, Module } from '@nestjs/common'
import { CronService } from './cron.service'
import { UsersModule } from '../users/users.module'
import { NotificationModule } from '../notification/notification.module'
import { ReportModule } from '../report/report.module'

@Module({
  imports: [UsersModule, NotificationModule, ReportModule],
  providers: [CronService, Logger],
})
export class CronModule {}
