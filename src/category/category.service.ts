import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Repository } from 'typeorm'
import { Category } from 'src/common/entities/category.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto)
  }

  findAll() {
    return this.categoryRepository.find()
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({ where: { id } })
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto)
  }

  remove(id: number) {
    return this.categoryRepository.delete(id)
  }
}
