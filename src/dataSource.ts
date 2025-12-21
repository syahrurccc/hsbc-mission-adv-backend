import { DataSource } from "typeorm";
import "reflect-metadata";

import { env } from "./env";
import { Movie } from "./entity/Movie";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_UNAME,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: [Movie, User],
  synchronize: true,
  logging: false,
});

try {
  await AppDataSource.initialize();
} catch (err) {
  console.log(err)
}
