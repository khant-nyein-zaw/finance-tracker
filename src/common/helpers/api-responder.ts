import { ApiResponse } from '../dto/api-response.dto'
import { MessageType } from '../interfaces/message-type.interface'

export function apiResponse<T>(
  statusCode: number,
  message: MessageType[],
  data: T | null = null,
): ApiResponse<T> {
  const response = new ApiResponse<T>()
  response.statusCode = statusCode
  response.message = message
  response.data = data
  return response
}
