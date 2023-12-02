import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class OrdersService {

  private readonly logger = new Logger('OrderService')

  constructor(
    
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ){}

  async create(createOrderDto: CreateOrderDto) {
    
    console.log(createOrderDto)

    const client = await this.userRepository.findOneBy({
      id: createOrderDto.clientId,
    });


    const user = await this.userRepository.findOneBy({
      id: createOrderDto.userId,
    });

    if (!user ) throw new NotFoundException('No se encontro el usuario');
    if (!client ) throw new NotFoundException('No se encontro el cliente');
  
    try {

      const order = this.orderRepository.create(createOrderDto);
      order.user = user;
      order.client = client;

      await this.orderRepository.save(order);
      return order;

    } catch (error) {
      this.handleExceptions(error);
    }
  
  }

  async findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }


  private handleExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Internal Server Error')
  }
}
