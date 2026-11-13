// Repositorio de progreso - acceso a datos MySQL
import { db } from "@nodejs-lab/db";
import type { LessonProgress, ProgressStatus } from "@nodejs-lab/shared";

export const progressRepository = {
  async findByLessonId(lessonId: string, userId = "anonymous") {
    const rows = await db.query<any>(
      "SELECT * FROM lesson_progress WHERE lesson_id = ? AND user_id = ?",
      [lessonId, userId]
    );
    return rows[0] ?? null;
  },

  async upsert(lessonId: string, status: ProgressStatus, userId = "anonymous") {
    const existing = await this.findByLessonId(lessonId, userId);
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (existing) {
      await db.execute(
        `UPDATE lesson_progress
         SET status = ?,
             opened_at = COALESCE(opened_at, ?),
             attempted_at = CASE WHEN ? = 'attempted' THEN ? ELSE attempted_at END,
             approved_at = CASE WHEN ? = 'approved' THEN ? ELSE approved_at END,
             attempts_count = attempts_count + 1,
             last_activity_at = ?
         WHERE lesson_id = ? AND user_id = ?`,
        [status, now, status, now, status, now, now, lessonId, userId]
      );
    } else {
      await db.execute(
        `INSERT INTO lesson_progress (id, lesson_id, user_id, status, opened_at, attempted_at, approved_at, attempts_count, last_activity_at)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, 1, ?)`,
        [lessonId, userId, status, status === "read" ? now : null, status === "attempted" ? now : null, status === "approved" ? now : null, now]
      );
    }

    return this.findByLessonId(lessonId, userId);
  },

  async findAllByUser(userId = "anonymous") {
    return db.query<any>(
      "SELECT * FROM lesson_progress WHERE user_id = ? ORDER BY updated_at DESC",
      [userId]
    );
  },
};
