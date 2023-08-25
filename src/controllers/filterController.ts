import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Product } from '../database/entities/Product';
import { paginate } from '../database/paginator';
import { Brand } from '../database/entities/Brand';

export const filteredProduct = async (req: Request, res: Response) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const brandRepo = AppDataSource.getRepository(Brand);

    let queryBuilder = productRepo.createQueryBuilder('product');

    if (req.body.brand) {
      const brandNames = req.body.brand;

      const brandIds = await brandRepo
        .createQueryBuilder('brand')
        .select('brand.brand_id')
        .where('brand.brand_name IN (:...brandNames)', { brandNames })
        .getMany();

      const brandIdArray = brandIds.map(brand => brand.brand_id);

      if (brandIdArray.length > 0) {
        queryBuilder = queryBuilder.where(
          'product.brand_id IN (:...brandIds)',
          {
            brandIds: brandIdArray,
          }
        );
      }
    }

    if (req.body.ram) {
      const ramConditions = req.body.ram.map((ram: string) => {
        return `product.specification->>'RAM' ILIKE '%${ram}%'`;
      });
      queryBuilder = queryBuilder.andWhere(`(${ramConditions.join(' OR ')})`);
    }

    if (req.body.storage) {
      const storageConditions = req.body.storage.map((storage: string) => {
        return `product.specification->>'Storage' ILIKE '%${storage}%'`;
      });
      queryBuilder = queryBuilder.andWhere(
        `(${storageConditions.join(' OR ')})`
      );
    }

    const { records, PaginationInfo } = await paginate(queryBuilder, req);

    return res.json({ records, PaginationInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
