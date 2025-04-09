import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(email: string, password: string) {
    const saltRound = genSaltSync()
    const hashedPassword = hashSync(password, saltRound)

    try {
      const { password, ...userWithoutPassword } =
        await this.usersService.create(email, hashedPassword)

      return {
        access_token: await this.jwtService.signAsync(
          { sub: userWithoutPassword.id, email: userWithoutPassword.email },
          { secret: this.configService.get('jwt.secret') },
        ),
        user: userWithoutPassword,
      }
    } catch {
      throw new InternalServerErrorException('Failed when creating a new user!')
    }
  }

  async signIn(
    email: string,
    hashedPassword: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email)

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    if (!compareSync(hashedPassword, user.password)) {
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
