import { Logger, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DatabaseModule } from 'src/db/db.module'
import { UsersService } from 'src/users/users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/common/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { JwtConfigService } from 'config/jwt-config.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { IsUniqueConstraint } from '../common/validators/is-unique.validator'

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({ useClass: JwtConfigService }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    Logger,
    IsUniqueConstraint,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
