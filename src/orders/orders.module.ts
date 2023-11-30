import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/order-details.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [ 
    TypeOrmModule.forFeature([Order, OrderDetails]),
  ],
})
export class OrdersModule {}
