import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoriesTable1692622515342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE categories (
                category_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE categories`);
  }
}
