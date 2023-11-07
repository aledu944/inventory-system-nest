import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Provider } from 'src/providers/entities/provider.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [ 
    TypeOrmModule.forFeature([Product, Category, Brand, Provider]),
    AuthModule,
  ],
  exports: [
    ProductsService
  ]
})
export class ProductsModule {}
