// src/orders/dto/create-order.dto.ts
import { IsNotEmpty, IsNumber, IsBoolean, IsInt, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  buyerId: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsArray()
  orderProducts: OrderProductDto[];
}

export class OrderProductDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
