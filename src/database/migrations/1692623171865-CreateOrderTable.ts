import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1692623171865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE orders (
            order_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            total_amount NUMERIC NOT NULL,
            status VARCHAR(255) NOT NULL,
            address TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE orders;`);
  }
}
