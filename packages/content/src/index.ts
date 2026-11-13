// Esquemas de validación para lecciones y ejercicios (datos de contenido).
// Importa los tipos base de @shared.

import { z } from "zod";
import { lessonIdSchema, exerciseIdSchema, exerciseDifficultySchema } from "@nodejs-lab/shared";

export const lessonSectionSchema = z.enum([
  "objective",
  "prerequisites",
  "explanation",
  "analogy",
  "example",
  "lineByLine",
  "outputPrediction",
  "guidedExercise",
  "independentExercise",
  "autoTests",
  "progressiveHints",
  "solution",
  "commonErrors",
  "summary",
  "shortEvaluation",
]);
export type LessonSection = z.infer<typeof lessonSectionSchema>;

export const lessonSchema = z.object({
  id: lessonIdSchema,
  levelId: z.string().uuid(),
  moduleId: z.string().uuid(),
  order: z.number().int().positive(),
  title: z.string().min(1).max(140),
  objective: z.string().min(1),
  sections: z.record(lessonSectionSchema, z.string().min(1)),
  exercises: z.array(exerciseIdSchema).default([]),
  estimatedMinutes: z.number().int().positive().default(30),
});
export type Lesson = z.infer<typeof lessonSchema>;

// Plantilla de las 15 secciones obligatorias por lección.
export const REQUIRED_LESSON_SECTIONS: LessonSection[] = [
  "objective",
  "prerequisites",
  "explanation",
  "analogy",
  "example",
  "lineByLine",
  "outputPrediction",
  "guidedExercise",
  "independentExercise",
  "autoTests",
  "progressiveHints",
  "solution",
  "commonErrors",
  "summary",
  "shortEvaluation",
];

export function validateLessonSections(sections: Record<LessonSection, string>): string[] {
  const missing: string[] = [];
  for (const section of REQUIRED_LESSON_SECTIONS) {
    if (!sections[section] || sections[section].trim().length === 0) {
      missing.push(section);
    }
  }
  return missing;
}
