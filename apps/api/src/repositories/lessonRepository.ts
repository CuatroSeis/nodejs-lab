// Repositorio de lecciones - acceso a datos MySQL
import { db } from "@nodejs-lab/db";
import type { Lesson } from "@nodejs-lab/content";

export const lessonRepository = {
  async findByModuleId(moduleId: string): Promise<Lesson[]> {
    const rows = await db.query<Lesson & { sections?: string }>(
      "SELECT id, level_id as levelId, module_id as moduleId, order_index as `order`, title, objective, sections, estimated_minutes as estimatedMinutes FROM lessons WHERE module_id = ? ORDER BY order_index ASC",
      [moduleId]
    );
    return rows.map((row) => ({
      ...row,
      sections:
        typeof row.sections === "string" ? JSON.parse(row.sections) : row.sections ?? {},
    }));
  },

  async findById(lessonId: string): Promise<Lesson | null> {
    const rows = await db.query<Lesson & { sections?: string }>(
      "SELECT id, level_id as levelId, module_id as moduleId, order_index as `order`, title, objective, sections, estimated_minutes as estimatedMinutes FROM lessons WHERE id = ? LIMIT 1",
      [lessonId]
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      sections: typeof row.sections === "string" ? JSON.parse(row.sections) : row.sections ?? {},
    };
  },
};
