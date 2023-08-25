import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBrandTable1692622470898 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE brands (
            brand_id SERIAL PRIMARY KEY,
            brand_name VARCHAR(255) NOT NULL
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE brands`);
  }
}
