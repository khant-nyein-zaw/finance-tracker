import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TransactionsModule } from './transactions/transactions.module'
import { DatabaseModule } from './db/db.module'
import { ConfigModule } from '@nestjs/config'
import app from 'config/app'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [app],
    }),
    DatabaseModule,
    CategoryModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
