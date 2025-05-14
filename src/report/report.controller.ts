import { Controller, Get, Param, Query } from '@nestjs/common'
import { ReportService } from './report.service'
import { GetReportDto } from './dto/get-report.dto'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('income-vs-expense/:user_id')
  getIncomeVsExpense(
    @Param('user_id') userId: number,
    @Query() getReportDto: GetReportDto,
  ) {
    return this.reportService.getIncomeVsExpense(userId, getReportDto)
  }

  @Get('spending-by-category/:user_id')
  getSpendingByCategory(
    @Param('user_id') userId: number,
    @Query() getReportDto: GetReportDto,
  ) {
    return this.reportService.getSpendingByCategory(userId, getReportDto)
  }
}
