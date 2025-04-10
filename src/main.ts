import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { useContainer } from 'class-validator'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'FinanceTracker',
    }),
  })
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.set('query parser', 'extended')
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
