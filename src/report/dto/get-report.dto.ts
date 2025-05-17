import { IsNotEmpty, IsDateString } from 'class-validator'

export class GetReportDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: Date

  @IsNotEmpty()
  @IsDateString()
  endDate: Date
}
