import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderProductsEntity } from './entities/order-products.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,


    @InjectRepository(OrderProductsEntity)
    private readonly orderProductsRepository: Repository<OrderProductsEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    // Busca al usuario que es el comprador
    const buyer = await this.userRepository.findOne({ where: { userId: createOrderDto.buyerId } });

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
    for (const op of createOrderDto.orderProducts){
      const opRepo = this.orderProductsRepository.create({
        order: order,
        product: {product_id: op.productId},
        quantity: op.quantity
      })

      await this.orderProductsRepository.save(opRepo);
    }

    return order_res;
  }

  // Obtener todas las órdenes
  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({ relations: ['orderProducts', 'buyer'] });
  }

  // Obtener una orden por ID
  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['orderProducts','orderProducts.product', 'buyer'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Editar una orden existente
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
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
  async filter(status: boolean): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: { status },
      relations: ['orderProducts', 'buyer'],
    });
  }
}
