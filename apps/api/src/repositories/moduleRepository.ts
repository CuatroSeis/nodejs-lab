// Repositorio de módulos - acceso a datos MySQL
import { db } from "@nodejs-lab/db";
import type { Module } from "@nodejs-lab/shared";

export const moduleRepository = {
  async findByLevelId(levelId: string): Promise<Module[]> {
    const rows = await db.query<Module>(
      "SELECT id, level_id as levelId, order_index as `order`, title, description FROM modules WHERE level_id = ? ORDER BY order_index ASC",
      [levelId]
    );
    return rows;
  },
};
