import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
