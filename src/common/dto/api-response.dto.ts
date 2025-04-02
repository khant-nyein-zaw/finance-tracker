import { MessageType } from '../interfaces/message-type.interface'

export class ApiResponse<T> {
  statusCode: number
  message: MessageType[] | []
  data: T | null
}
