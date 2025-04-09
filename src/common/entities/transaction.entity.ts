import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Category } from './category.entity'
import { TransactionType } from '../enums/transaction-type.enum'
import { User } from './user.entity'

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('enum', { enum: TransactionType })
  type: string

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @Column({ type: 'text', nullable: true })
  description: string

  @Column('date')
  date: Date

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId: number

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number

  @ManyToOne(() => User, (user) => user.transactions)
  user: User

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn({ name: 'category_id' })
  category: Category
}
