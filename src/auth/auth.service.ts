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
    console.log(hashedPassword)

    try {
      const { password, ...userWithPassword } = await this.usersService.create(
        email,
        hashedPassword,
      )

      return {
        access_token: await this.jwtService.signAsync(
          { sub: userWithPassword.id, email: userWithPassword.email },
          { secret: this.configService.get('jwt.secret') },
        ),
        user: userWithPassword,
      }
    } catch {
      throw new InternalServerErrorException(null, {
        description: 'Failed when creating a new user!',
      })
    }
  }

  async signIn(
    email: string,
    hashedPassword: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email)

    if (!user) {
      throw new NotFoundException(null, { description: 'User not found!' })
    }

    if (!compareSync(hashedPassword, user.password)) {
      throw new UnauthorizedException(null, {
        description: 'Wrong credentials!',
      })
    }

    const { password, ...userWithPassword } = user
    const payload = { sub: userWithPassword.id, email: userWithPassword.email }

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
      }),
    }
  }
}
