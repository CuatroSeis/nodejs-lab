// Repositorio de resultados de intentos - acceso a datos MySQL
import { db } from "@nodejs-lab/db";
import type { TestResult } from "@nodejs-lab/shared";

export const attemptRepository = {
  async create(attempt: {
    lessonId: string;
    userId?: string;
    exerciseId?: string;
    result: "approved" | "failed" | "attempted";
    score?: number;
  }) {
    const { lessonId, userId = "anonymous", exerciseId, result, score = 0 } = attempt;
    await db.execute(
      `INSERT INTO attempt_results (id, lesson_id, user_id, exercise_id, result, score)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [lessonId, userId, exerciseId ?? null, result, score]
    );
  },

  async findByLesson(lessonId: string, userId = "anonymous") {
    return db.query<TestResult & { score?: number; executedAt?: string }>(
      "SELECT * FROM attempt_results WHERE lesson_id = ? AND user_id = ? ORDER BY executed_at DESC",
      [lessonId, userId]
    );
  },
};
