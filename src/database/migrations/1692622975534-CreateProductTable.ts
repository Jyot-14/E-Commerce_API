import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1692622975534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE product (
            product_id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC NOT NULL,
            specification JSONB NOT NULL,
            quantity_available INT NOT NULL,
            brand_id INT REFERENCES brands(brand_id),
            category_id INT REFERENCES categories(category_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE product;`);
  }
}
