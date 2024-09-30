// src/orders/entities/order-products.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../products/entities/product.entity'; // Asegúrate de que esta ruta sea correcta

@Entity('order_products', { schema: 'linktic' })
export class OrderProductsEntity {
  @PrimaryGeneratedColumn({ name: 'order_products_id' })
  orderProductsId: number;

  @ManyToOne(() => OrderEntity, order => order.orderProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' }) // Nombre de la columna en la base de datos
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, product => product.orderProducts)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ type: 'int' })
  quantity: number;
  
}
