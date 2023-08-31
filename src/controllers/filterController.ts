import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Product } from '../database/entities/Product';
import { paginate } from '../database/paginator';
import { Brand } from '../database/entities/Brand';
import { Category } from '../database/entities/Category';

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

    // Modify the query to include image URLs
    queryBuilder = queryBuilder
      .leftJoinAndSelect('product.images', 'product_image')
      .addSelect(['product_image.image']);

    const { records, PaginationInfo } = await paginate(queryBuilder, req);

    return res.json({ records, PaginationInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFilterOptions = async (_req: Request, res: Response) => {
  const productRepo = AppDataSource.getRepository(Product);
  const categoryRepo = AppDataSource.getRepository(Category);

  try {
    const categories = await categoryRepo.find();

    const filterOptions = {};

    for (const category of categories) {
      const brands = await productRepo
        .createQueryBuilder('product')
        .select('DISTINCT brand.brand_name', 'brand_name')
        .leftJoin('product.brand', 'brand')
        .where('product.category_id = :category_id', {
          category_id: category.category_id,
        })
        .getRawMany();

      const ramOptions = await productRepo
        .createQueryBuilder('product')
        .select("DISTINCT product.specification->>'RAM'", 'ram')
        .where('product.category_id = :category_id', {
          category_id: category.category_id,
        })
        .getRawMany();

      let storageOptions: string[] = [];
      if (category.name === 'laptopData') {
        const ssdOptions = await productRepo
          .createQueryBuilder('product')
          .select(
            "DISTINCT product.specification->>'SSDCapacity'",
            'ssd_capacity'
          )
          .where('product.category_id = :category_id', {
            category_id: category.category_id,
          })
          .getRawMany();

        const hddOptions = await productRepo
          .createQueryBuilder('product')
          .select(
            "DISTINCT product.specification->>'HDDCapacity'",
            'hdd_capacity'
          )
          .where('product.category_id = :category_id', {
            category_id: category.category_id,
          })
          .getRawMany();

        storageOptions = [
          ...ssdOptions.map(entry => entry.ssd_capacity),
          ...hddOptions.map(entry => entry.hdd_capacity),
        ].filter(option => option !== null);
      } else {
        storageOptions = (
          await productRepo
            .createQueryBuilder('product')
            .select("DISTINCT product.specification->>'Storage'", 'storage')
            .where('product.category_id = :category_id', {
              category_id: category.category_id,
            })
            .getRawMany()
        )
          .map(entry => entry.storage)
          .filter(option => option !== null);
      }

      filterOptions[category.name] = {
        brand: brands.map(entry => entry.brand_name),
        ram: ramOptions.map(entry => entry.ram),
        storage: storageOptions,
      };
    }

    return res.json({ filterOptions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
