import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Transaction } from './transaction.entity'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('IDX_users_email')
  @Column({ unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[]
}
