import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { TransactionsModule } from './transactions/transactions.module'
import { DatabaseModule } from './db/db.module'
import { ConfigModule } from '@nestjs/config'
import app from 'config/app'
import { CategoryModule } from './category/category.module'
import { logger } from './common/middleware/logger.middleware'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ReportModule } from './report/report.module'
import { ScheduleModule } from '@nestjs/schedule'
import { CronModule } from './cron/cron.module'
import { NotificationModule } from './notification/notification.module'
import { FcmModule } from './fcm/fcm.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [app],
    }),
    DatabaseModule,
    CategoryModule,
    TransactionsModule,
    UsersModule,
    AuthModule,
    ReportModule,
    ScheduleModule.forRoot(),
    CronModule,
    NotificationModule,
    FcmModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes({
      path: '{*path}',
      method: RequestMethod.GET,
    })
  }
}
