import { createPool, type PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });

let _pool: ReturnType<typeof createPool> | null = null;

function getPool() {
  if (!_pool) {
    const poolOptions: PoolOptions = {
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_DATABASE ?? "nodejs_lab",
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
      charset: "utf8mb4",
    };
    _pool = createPool(poolOptions);
  }
  return _pool;
}

// Funciones internas: NO exportadas para evitar SQL injection
// El SQL debe ser un string estático con placeholders ?, nunca concatenado con variables de usuario
async function queryInternal<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  const [rows] = await getPool().query(sql, params ?? []);
  return rows as T[];
}

async function executeInternal(sql: string, params?: unknown[]): Promise<{ affectedRows: number; insertId: number }> {
  const [result] = await getPool().query(sql, params ?? []);
  return {
    affectedRows: (result as any).affectedRows,
    insertId: (result as any).insertId,
  };
}

// Interfaz tipada para acceso seguro a la base de datos
// Todos los métodos requieren parámetros explícitos para prevenir SQL injection
export const db = {
  /**
   * Ejecuta una consulta SELECT con parámetros obligatorios.
   * El SQL debe ser un string estático con placeholders ?, nunca concatenado con variables de usuario.
   */
  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    return queryInternal<T>(sql, params);
  },

  /**
   * Ejecuta una consulta INSERT/UPDATE/DELETE con parámetros obligatorios.
   * El SQL debe ser un string estático con placeholders ?, nunca concatenado con variables de usuario.
   */
  async execute(sql: string, params: unknown[] = []): Promise<{ affectedRows: number; insertId: number }> {
    return executeInternal(sql, params);
  },

  async close(): Promise<void> {
    if (_pool) {
      await _pool.end();
      _pool = null;
    }
  },
};

export default db;
