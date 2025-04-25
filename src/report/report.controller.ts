import { Controller, Get, Query } from '@nestjs/common'
import { ReportService } from './report.service'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('income-vs-expense')
  getIncomeVsExpense(
    @Query('userId') userId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getIncomeVsExpense(userId, startDate, endDate)
  }

  @Get('spending-by-category')
  getSpendingByCategory(
    @Query('userId') userId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getSpendingByCategory(userId, startDate, endDate)
  }
}
