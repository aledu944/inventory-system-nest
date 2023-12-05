import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums/meta-roles';

@Controller('orders')
@Auth(ValidRoles.admin, ValidRoles.employee)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
  
  @Get('/client/:clientId')
  findAllCustomerOrders(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.ordersService.findAllCustomerOrders( clientId );
  }

    
  @Get('/user/:userId')
  findAllUserSales(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.ordersService.findAllUserSales( userId );
  }


  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
