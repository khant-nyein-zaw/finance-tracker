import { Injectable } from '@nestjs/common'
import { Transaction } from './interfaces/transactions.interface'

@Injectable()
export class TransactionsService {
  private transactions: Transaction[]

  index(): Transaction[] {
    return this.transactions
  }

  create(params: Transaction) {
    if (this.transactions) {
      this.transactions.push(params)
    } else {
      this.transactions = []
      this.transactions.push(params)
    }

    return this.transactions
  }
}
