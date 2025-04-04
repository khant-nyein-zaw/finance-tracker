import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'FinanceTracker',
    }),
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.set('query parser', 'extended')
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
