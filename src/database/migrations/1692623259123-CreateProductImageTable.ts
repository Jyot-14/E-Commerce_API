import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductImageTable1692623259123
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE product_image (
            id SERIAL PRIMARY KEY,
            product_id INT NOT NULL,
            image VARCHAR(255) NOT NULL,
            FOREIGN KEY (product_id) REFERENCES product(product_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE product_image;`);
  }
}
