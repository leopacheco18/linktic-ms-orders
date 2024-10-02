import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderProductsEntity } from './entities/order-products.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderProductsEntity)
    private readonly orderProductsRepository: Repository<OrderProductsEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private httpService: HttpService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    token: string,
  ): Promise<OrderEntity> {
    // Busca al usuario que es el comprador
    const url = 'http://linktic-ms-auth:3005//users/validate-token';
    const headers = {
      accept: '*/*',
      Authorization: 'Bearer ' + token,
    };
    let data = { user_id: 1 };
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, {}, { headers }),
      );
      data = response.data;
    } catch (error) {
      throw new Error(`Error validating token: ${error.message}`);
    }

    console.log(data)

    const buyer = await this.userRepository.findOne({
      where: { userId: data.user_id },
    });

    if (!buyer) {
      throw new Error('Buyer not found'); // Maneja errores en caso de no encontrar el comprador
    }

    // Crea la orden y asigna manualmente las relaciones
    const order = this.orderRepository.create({
      buyer,
      total: createOrderDto.total,
      status: createOrderDto.status ?? true, // Asume que el estado es true si no se especifica
    });

    const order_res = await this.orderRepository.save(order);
    for (const op of createOrderDto.orderProducts) {
      const product = this.httpService.get(
        `http://linktic-ms-products:3003/products/${op.productId}`,
      );
      const { data } = await firstValueFrom(product);
      const opRepo = this.orderProductsRepository.create({
        order: order,
        product: data,
        quantity: op.quantity,
      });

      await this.orderProductsRepository.save(opRepo);
    }

    return order_res;
  }

  // Obtener todas las órdenes
  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      relations: ['orderProducts', 'buyer', 'orderProducts.product'],
    });
  }

  // Obtener una orden por ID
  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['orderProducts', 'orderProducts.product', 'buyer'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Editar una orden existente
  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    const order = await this.findOne(id);
    const updatedOrder = this.orderRepository.merge(order, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }

  // Eliminar una orden por ID
  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  // Filtrar órdenes por estado
  async filter(token: string): Promise<OrderEntity[]> {
    const url = 'http://linktic-ms-auth:3005/users/validate-token';
    const headers = {
      accept: '*/*',
      Authorization: 'Bearer ' + token,
    };
    let data = { user_id: 1 };
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, {}, { headers }),
      );
      data = response.data;
    } catch (error) {
      throw new Error(`Error validating token: ${error.message}`);
    }

    console.log(data)

    return this.orderRepository.find({
      where: { buyer: { userId: data.user_id } },
      relations: ['orderProducts', 'buyer'],
    });
  }
}
