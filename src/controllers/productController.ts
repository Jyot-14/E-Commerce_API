import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Product } from '../database/entities/Product';
import { paginate } from '../database/paginator';

export const searchProduct = async (req: Request, res: Response) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);

    let queryBuilder = productRepo.createQueryBuilder('product');

    if (req.query.search) {
      const searchTerm = `%${req.query.search}%`;
      queryBuilder = queryBuilder.andWhere('product.title ILIKE :searchTerm', {
        searchTerm,
      });
    }

    const { records: products, PaginationInfo } = await paginate(
      queryBuilder,
      req
    );

    return res.json({ products, PaginationInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getProductsWithFilters = async (req: Request, res: Response) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);

    let queryBuilder = productRepo.createQueryBuilder('product');

    if (req.query.category_id) {
      queryBuilder = queryBuilder.where('product.category_id = :category_id', {
        category_id: req.query.category_id,
      });
    }

    if (req.query.brand_id) {
      queryBuilder = queryBuilder.where('product.brand_id = :brand_id', {
        brand_id: req.query.brand_id,
      });
    }

    if (req.query.ram) {
      queryBuilder = queryBuilder.andWhere(
        `product.specification->>'RAM' ILIKE :ram`,
        {
          ram: `%${req.query.ram}%`,
        }
      );
    }

    if (req.query.storage) {
      queryBuilder = queryBuilder.andWhere(
        `product.specification->>'Storage' ILIKE :storage`,
        {
          storage: `%${req.query.storage}%`,
        }
      );
    }

    const { records: products, PaginationInfo } = await paginate(
      queryBuilder,
      req
    );

    return res.json({ products, PaginationInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
