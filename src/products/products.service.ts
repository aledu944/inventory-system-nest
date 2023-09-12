import { Injectable, InternalServerErrorException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID } from "uuid";

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){} 

  async create(createProductDto: CreateProductDto) {    
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      
      return product;
    
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset
    });    
    
    return products;
    
  }

  async findOne(term: string) {
    
    if( isUUID(term) ){
      const product = await this.productRepository.findOneBy({ id: term });
      
      if( !product ) throw new NotFoundException('No se encontro el producto');
      
      return product;
    }

    const product = await this.productRepository.findOneBy({ slug: term });
    
    if( !product ) throw new NotFoundException('No se encontro el producto');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
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
