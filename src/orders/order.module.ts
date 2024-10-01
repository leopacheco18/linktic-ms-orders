// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './entities/order.entity';
import { OrderProductsEntity } from './entities/order-products.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderProductsEntity, UserEntity]),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
