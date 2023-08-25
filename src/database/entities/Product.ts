import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ProductImage } from './ProductImage';
import { OrderDetail } from './OrderDetail';
import { Brand } from './Brand';
import { Category } from './Category';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column('jsonb')
  specification: object;

  @Column()
  quantity_available: number;

  @OneToMany(() => ProductImage, image => image.product)
  images: ProductImage[];

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
  orderDetails: OrderDetail[];

  @ManyToOne(() => Brand, brand => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
