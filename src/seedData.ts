import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { Brand } from './database/entities/Brand';
import { Category } from './database/entities/Category';
import { Product } from './database/entities/Product';
import { ProductImage } from './database/entities/ProductImage';
import { AppDataSource } from './database/data-source';

export async function storeData() {
  const connection = await AppDataSource.initialize();

  const dataFilePath = path.join(__dirname, '../data.json');
  const rawData = fs.readFileSync(dataFilePath, 'utf-8');
  const data = JSON.parse(rawData);
  console.log(data);

  // Outside the loop that iterates over brandDataArray
  const brandNamesSet = new Set<string>();
  const categoryNamesSet = new Set<string>();

  // Iterate over brands within the category data
  for (const categoryName in data) {
    if (data.hasOwnProperty(categoryName)) {
      const categoryData = data[categoryName];

      // Iterate over brands within the category data
      for (const brandName in categoryData) {
        if (categoryData.hasOwnProperty(brandName)) {
          const brandDataArray = categoryData[brandName];

          if (!brandNamesSet.has(brandName)) {
            const brand = new Brand();
            brand.brand_name = brandName;
            await connection.manager.save(brand);
            brandNamesSet.add(brandName);
          }

          if (!categoryNamesSet.has(categoryName)) {
            const category = new Category();
            category.name = categoryName;
            await connection.manager.save(category);
            categoryNamesSet.add(categoryName);
          }

          // Iterate over products within the brand data
          for (const brandData of brandDataArray) {
            const product = new Product();
            product.title = brandData.title;
            product.description = brandData.description;
            product.price = parseFloat(
              brandData.sellingPrice.replace('₹', '').replace(',', '')
            );
            product.specification = brandData.Specification || {};
            product.quantity_available = 10;

            const brandEntity = await connection
              .getRepository(Brand)
              .createQueryBuilder('brand')
              .where('brand.brand_name = :brandName', { brandName })
              .getOne();

            if (brandEntity) {
              product.brand = brandEntity;
            }

            const categoryEntity = await connection
              .getRepository(Category)
              .createQueryBuilder('category')
              .where('category.name = :categoryName', { categoryName })
              .getOne();

            if (categoryEntity) {
              product.category = categoryEntity;
            }

            try {
              const savedProduct = await connection.manager.save(product);
              console.log(`Product "${product.title}" saved successfully.`);

              // Save images for the product
              for (const imageUrl of brandData.images) {
                const productImage = new ProductImage();
                productImage.product = savedProduct;
                productImage.image = imageUrl;

                await connection.manager.save(productImage);
                console.log(
                  `Image "${imageUrl}" saved for product "${product.title}".`
                );
              }
            } catch (error) {
              console.error('Error saving product:', error);
            }
          }
        }
      }
    }
  }
}
