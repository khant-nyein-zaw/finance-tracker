import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts'
import { ConfigService } from '@nestjs/config'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: any }> {
    const saltRound = genSaltSync()
    const hashedPassword = hashSync(registerDto.password, saltRound)

    try {
      const { password, ...userWithoutPassword } =
        await this.usersService.create(registerDto.email, hashedPassword)

      return {
        access_token: await this.jwtService.signAsync(
          { sub: userWithoutPassword.id, email: userWithoutPassword.email },
          { secret: this.configService.get('jwt.secret') },
        ),
        user: userWithoutPassword,
      }
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Failed when creating a new user!')
    }
  }

  async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneBy(loginDto.email)

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    if (!compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Wrong credentials!')
    }

    const { password, ...userWithoutPassword } = user
    const payload = {
      sub: userWithoutPassword.id,
      email: userWithoutPassword.email,
    }

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
      }),
    }
  }
}
