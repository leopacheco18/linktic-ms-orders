import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';

@Entity('users', { schema: 'linktic' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  @ApiProperty({ description: 'ID del usuario' })
  userId: number;

  @Column({ type: 'varchar' })
  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @Column({ type: 'varchar' })
  @ApiProperty({ description: 'Clave del usuario' })
  password: string;


  @Column({ type: 'varchar' })
  @ApiProperty({ description: 'Rol del usuario' })
  role: string;


  @OneToMany(() => OrderEntity, order => order.buyer)
  @ApiProperty({ description: 'Ordenes del usuario' })
  @JoinColumn({ name: 'buyer_id' }) // Nombre de la columna en la base de datos
  orders: OrderEntity[]; // Relación inversa de OneToMany
}
