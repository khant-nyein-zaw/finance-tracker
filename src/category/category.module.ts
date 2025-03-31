import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { DatabaseModule } from 'src/db/db.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from 'src/common/entities/category.entity'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
