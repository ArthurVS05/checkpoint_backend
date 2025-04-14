import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  // Database engine
  type: "sqlite",
  // Database's filename
  database: "check_backend_alternance.sqlite",
  // Entities directory
  entities: ["src/entities/*.ts"],
  // Tells TypeORM to automatically create database tables base on defined entities
  synchronize: true,
  // Display logs in terminal
  logging: true,
});
