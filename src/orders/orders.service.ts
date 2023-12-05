import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { OrderDetails } from './entities/order-details.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {

  private readonly logger = new Logger('OrderService')

  constructor(

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) { }

  async create(createOrderDto: CreateOrderDto) {

    const client = await this.userRepository.findOneBy({
      id: createOrderDto.clientId,
    });


    const user = await this.userRepository.findOneBy({
      id: createOrderDto.userId,
    });

    if (!user) throw new NotFoundException('No se encontro el usuario');
    if (!client) throw new NotFoundException('No se encontro el cliente');

    try {

      // CREAR ORDEN
      const order = this.orderRepository.create(createOrderDto);
      order.user = user;
      order.client = client;
      await this.orderRepository.save(order);

      // DETALLES
      const { items } = createOrderDto;

      const productsPromise = items.map(async ({ productId }) => {
        return await this.productRepository.findOneBy({ id: productId });
      })
      const products = await Promise.all(productsPromise);

      products.map((product, index) => {
        if (product.stock < items[index].quantity) {
          throw new BadRequestException('No hay suficiente stock');
        }
      })

      products.map(async (product, index) => {
        const newDetail = this.orderDetailsRepository.create({
          order: order,
          quantity: items[index].quantity,
          product: product,
        })

        product.stock -= items[index].quantity;

        await this.productRepository.save(product)
        await this.orderDetailsRepository.save(newDetail);
      })

      return {
        message: "Se genero la venta correctamente"
      };

    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async findAll() {

    const orders = await this.orderRepository.find({
      relations: {
        user: true,
        client: true,
        orderDetails: {
          product: true,
        },
      }
    })

    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        client: true,
        orderDetails: {
          product: true,
        }
      }
    })


    if (!order) throw new NotFoundException('No se pudo obtener la venta')
    return order;
  }


  async findAllCustomerOrders(clientId: string) {
    const orders = await this.orderRepository.find({
      where: {
        client: {
          id: clientId,
        }
      },
      relations: {
        user: true,
        orderDetails: {
          product: true,
        }
      },
    })

    return orders;
  }


  async findAllUserSales(userId: string) {
    const orders = await this.orderRepository.find({
      where: {
        user: {
          id: userId,
        }
      },
      relations: {
        client: true,
        orderDetails: {
          product: true,
        }
      },
    })

    return orders;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }


  private handleExceptions(error: any) {
    this.logger.error(error.status);
    if (error.status == 400) {
      throw new BadRequestException(error.message)
    }
    throw new InternalServerErrorException('Internal Server Error')
  }
}
