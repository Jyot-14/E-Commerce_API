import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  order_detail_id: number;

  @ManyToOne(() => Order, order => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, product => product.orderDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantities: number;
}
