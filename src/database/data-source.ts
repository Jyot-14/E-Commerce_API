import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Product } from './entities/Product';
import { Order } from './entities/Order';
import { OrderDetail } from './entities/OrderDetail';
import { ProductImage } from './entities/ProductImage';
import { Brand } from './entities/Brand';
import { Category } from './entities/Category';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_host,
  port: Number(process.env.DB_port),
  username: process.env.DB_user,
  password: process.env.DB_password,
  database: process.env.DB_database,
  synchronize: false,
  logging: true,
  entities: [User, Product, Order, OrderDetail, ProductImage, Brand, Category],
  migrations: ['src/database/migrations/*.ts'],
});
