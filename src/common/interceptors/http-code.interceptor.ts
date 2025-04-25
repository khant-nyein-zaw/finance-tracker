import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Response } from 'express'
import { map, Observable } from 'rxjs'
import { ApiResponse } from '../interfaces/api-response.interface'

@Injectable()
export class HttpCodeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<ApiResponse<any>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>()
        const statusCode = response.statusCode

        if (statusCode >= 200 && statusCode < 300) {
          return { ...data, statusCode }
        } else {
          return {
            message: [data?.message],
            data: null,
            statusCode,
          }
        }
      }),
    )
  }
}
