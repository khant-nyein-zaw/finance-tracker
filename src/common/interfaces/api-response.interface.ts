export interface ApiResponse<T> {
  message: string[]
  data: T | null
  statusCode: number
  error?: string
}
