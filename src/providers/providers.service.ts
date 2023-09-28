import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProvidersService {

  private readonly logger = new Logger('ProviderService');
  
  constructor(
    
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  
  ){}
  
  async create(createProviderDto: CreateProviderDto) {
    try {
      const provider = this.providerRepository.create(createProviderDto);
      await this.providerRepository.save(provider);
      
      return provider;    
    
    } catch (error) {

      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const providers = await this.providerRepository.find({
      take: limit,
      skip: offset
    });    
    
    return providers;
  }

  async findOne(id: string) {
    if( !isUUID(id) ){
      throw new BadRequestException('No se pudo obtener el proveedor');
    }

    const provider = await this.providerRepository.findOneBy({ id });
    
    if( !provider ) throw new NotFoundException('No se encontro el provider');
    
    return provider;

  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const provider = await this.providerRepository.preload({
      id,
      ...updateProviderDto
    })

    if( !provider ) throw new NotFoundException('No se encontro el proveedor');
    
    try {

      await this.providerRepository.save(provider);
      return provider; 
    
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const provider = await this.findOne(id);

    if( !provider ) throw new NotFoundException('No se encontro el proveedor');
        
    await this.providerRepository.delete(id);
    return { message: 'Se elimino el proveedor' };
  }

  private handleExceptions(error: any){
    this.logger.error(error);

    if( error.code === '23505' ){
      throw new BadRequestException('El proveedor ya existe')
    }
    
    throw new InternalServerErrorException('Internal Server Error')
  }
}
