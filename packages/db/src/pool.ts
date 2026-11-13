import { createPool, type PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });

const poolOptions: PoolOptions = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE ?? "nodejs_lab",
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  charset: "utf8mb4",
};

export const pool = createPool(poolOptions);

export default pool;
