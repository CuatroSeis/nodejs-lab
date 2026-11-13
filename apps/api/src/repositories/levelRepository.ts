// Repositorio de niveles - acceso a datos MySQL
import { db } from "@nodejs-lab/db";
import type { Level } from "@nodejs-lab/shared";

type LevelRow = {
  id: string;
  order: number;
  title: string;
  description: string;
  prerequisites: string | null;
};

export const levelRepository = {
  async findAll(): Promise<Level[]> {
    const rows = await db.query<LevelRow>(
      "SELECT id, order_index as `order`, title, description, prerequisites FROM levels ORDER BY order_index ASC"
    );
    return rows.map((row) => ({
      id: row.id,
      order: row.order,
      title: row.title,
      description: row.description,
      prerequisites:
        typeof row.prerequisites === "string"
          ? JSON.parse(row.prerequisites)
          : row.prerequisites ?? [],
    }));
  },

  async findById(id: string): Promise<Level | null> {
    const rows = await db.query<LevelRow>(
      "SELECT id, order_index as `order`, title, description, prerequisites FROM levels WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      order: row.order,
      title: row.title,
      description: row.description,
      prerequisites: row.prerequisites ? JSON.parse(row.prerequisites) : [],
    };
  },
};
