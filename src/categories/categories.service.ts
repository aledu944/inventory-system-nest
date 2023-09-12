import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';



@Injectable()
export class CategoriesService {

  private readonly logger = new Logger('CategoryService');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      
      return category;    
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto){
    
    const { limit = 10, offset = 0 } = paginationDto;

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset
    });    
    
    return categories;
  }

  async findOne(term: string) {
    
    if( isUUID(term) ){
      const category = await this.categoryRepository.findOneBy({ id: term });
      
      if( !category ) throw new NotFoundException('No se encontro la categoria');
      
      return category;
    }

    const category = await this.categoryRepository.findOneBy({ slug: term });
    
    if( !category ) throw new NotFoundException('No se encontro la categoria');

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto
    })

    if( !category ) throw new NotFoundException('No se encontro el categoria');
    
    try {

      await this.categoryRepository.save(category);
      return category; 
    
    } catch (error) {
    
      this.handleExceptions(error);
    
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if( !category ) throw new NotFoundException('No se encontro la categoria');
        
    await this.categoryRepository.delete(id);
    return { message: 'Categoria eliminada' };

  }

  private handleExceptions(error: any){
    this.logger.error(error);

    if( error.code === '23505' ){
      throw new BadRequestException('La categoria ya existe')
    }
    
    throw new InternalServerErrorException('Internal Server Error')
  }
}
