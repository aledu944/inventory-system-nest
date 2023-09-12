import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, InternalServerErrorException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';

import { Repository } from "typeorm";
import { validate as isUUID } from "uuid";
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Category } from 'src/categories/entities/category.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')
  
  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  
  ){} 

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({ 
      id: createProductDto.categoryId
    });

    if( !category ) throw new NotFoundException('La categoria no existe');

    try {

      const product = this.productRepository.create(createProductDto);
      product.category = category;
      
      await this.productRepository.save(product);
      return product;
    
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      relations: ['category'],
      take: limit,
      skip: offset
    });    
    
    return products;
    
  }

  async findOne(term: string) {
    
    if( isUUID(term) ){
      const product = await this.productRepository.find({
        where: {
          id: term
        },
        relations: {  category: true }
      });
      
      if( !product ) throw new NotFoundException('No se encontro el producto');
      
      return product[0];
    }

    const product = await this.productRepository.findOneBy({ slug: term });
    
    if( !product ) throw new NotFoundException('No se encontro el producto');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const category = await this.categoryRepository.findOneBy({ 
      id: updateProductDto.categoryId
    });
    
    if( !category ) throw new NotFoundException('La categoria no existe');

    const product = await this.productRepository.preload({
      id,
      category,
      ...updateProductDto
    })

    if( !product ) throw new NotFoundException('No se encontro el producto');
    
    try {

      await this.productRepository.save(product);
      return product; 
    
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if( !product ) throw new NotFoundException('No se encontro el producto');
        
    await this.productRepository.delete(id);
    return { message: 'Producto eliminado' };
  }

  private handleExceptions(error: any){
    this.logger.error(error);

    if( error.code === '23505' ){
      throw new BadRequestException('El producto ya existe')
    }
    
    throw new InternalServerErrorException('Internal Server Error')
  }
}
