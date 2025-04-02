import { NextFunction, Request, Response } from 'express'

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req
  res.on('finish', () => {
    const { statusCode } = res
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode}`,
    )
  })
  next()
}
