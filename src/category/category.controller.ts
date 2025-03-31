import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Response } from 'express'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get()
  async findAll(@Res() response: Response) {
    const data = await this.categoryService.findAll()
    if (data) {
      response.status(HttpStatus.OK).send(data)
    } else {
      response
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Category were not found!' })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const data = await this.categoryService.findOne(+id)

    if (data) {
      response.status(HttpStatus.OK).send(data)
    } else {
      response
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Category not found!' })
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }
}
