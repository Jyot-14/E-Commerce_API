import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './Product';

@Entity('product_image')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  image: string;
}
