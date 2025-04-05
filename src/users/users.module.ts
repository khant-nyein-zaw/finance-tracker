import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { DatabaseModule } from 'src/db/db.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/common/entities/user.entity'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
