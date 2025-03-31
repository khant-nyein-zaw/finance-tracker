import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm'
import { Category } from './category.entity'

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('enum', { enum: ['income', 'expense', 'transfer'] })
  type: string

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @Column('text')
  description: string

  @Column('date')
  date: Date

  @Column({ name: 'user_id', type: 'int' })
  userId: number

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number

  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category
}
