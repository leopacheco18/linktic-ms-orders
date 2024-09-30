import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderProductsEntity } from './order-products.entity';

@Entity('orders', { schema: 'linktic' })
export class OrderEntity {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => UserEntity, user => user.orders)
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  @Column({ type: 'numeric' })
  total: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'boolean' })
  status: boolean;

  @OneToMany(() => OrderProductsEntity, orderProducts => orderProducts.order)
  orderProducts: OrderProductsEntity[];
}
