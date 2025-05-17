import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/common/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  async findOneBy(email: string) {
    return this.usersRepository.findOne({ where: { email } })
  }

  async create(email: string, password: string) {
    return this.usersRepository.save({
      email,
      password,
    })
  }

  async findAll() {
    return this.usersRepository.find()
  }
}
