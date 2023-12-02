import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/order-details.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [ 
    TypeOrmModule.forFeature([Order, OrderDetails]),
    AuthModule,
  ],
  exports: [
    OrdersService,
  ]
})
export class OrdersModule {}
