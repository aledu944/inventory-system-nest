import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Brand } from 'src/brands/entities/brand.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class BrandsService {
  
  private readonly logger = new Logger('BrandService');


  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>
  ){}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = this.brandRepository.create(createBrandDto);
      await this.brandRepository.save(brand);
      
      return brand;    
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const brands = await this.brandRepository.find({
      take: limit,
      skip: offset
    });    
    
    return brands;
  }

  async findOne(term: string) {
    if( isUUID(term) ){
      const brand = await this.brandRepository.findOneBy({ id: term });
      
      if( !brand ) throw new NotFoundException('No se encontro la categoria');
      
      return brand;
    }

    const brand = await this.brandRepository.findOneBy({ slug: term });
    
    if( !brand ) throw new NotFoundException('No se encontro la categoria');

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id,
      ...updateBrandDto
    })

    if( !brand ) throw new NotFoundException('No se encontro el categoria');
    
    try {

      await this.brandRepository.save(brand);
      return brand; 
    
    } catch (error) {
    
      this.handleExceptions(error);
    
    }
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    if( !brand ) throw new NotFoundException('No se encontro la marca');
        
    await this.brandRepository.delete(id);
    return { message: 'Marca eliminada' };
  }

  private handleExceptions(error: any){
    this.logger.error(error);

    if( error.code === '23505' ){
      throw new BadRequestException('La marca ya se encuentra registrada')
    }
    
    throw new InternalServerErrorException('Internal Server Error')
  }
}
