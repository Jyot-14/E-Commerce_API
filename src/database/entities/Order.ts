import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { OrderDetail } from './OrderDetail';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column()
  total_amount: number;

  @Column()
  status: string;

  @Column()
  address: string;

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
  orderDetails: OrderDetail[];
}
