import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TransactionsModule } from './transactions/transactions.module'
import { DatabaseModule } from './db/db.module'
import { ConfigModule } from '@nestjs/config'
import app from 'config/app'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [app],
    }),
    DatabaseModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
