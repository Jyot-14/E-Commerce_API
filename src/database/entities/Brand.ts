import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Product';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column()
  brand_name: string;

  @OneToMany(() => Product, product => product.brand)
  products: Product[];
}
