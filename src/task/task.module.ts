import { Logger, Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { UsersModule } from '../users/users.module'
import { NotificationModule } from '../notification/notification.module'
import { ReportModule } from '../report/report.module'

@Module({
  imports: [UsersModule, NotificationModule, ReportModule],
  providers: [TaskService, Logger],
})
export class TaskModule {}
