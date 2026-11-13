// Tipos y esquemas Zod compartidos entre frontend y backend.
// Este paquete es el único contrato de datos entre apps/web y apps/api.

import { z } from "zod";

// -------- Identificadores --------

export const lessonIdSchema = z.string().min(1);
export type LessonId = z.infer<typeof lessonIdSchema>;

export const exerciseIdSchema = z.string().min(1);
export type ExerciseId = z.infer<typeof exerciseIdSchema>;

export const levelIdSchema = z.string().min(1);
export type LevelId = z.infer<typeof levelIdSchema>;

export const moduleIdSchema = z.string().min(1);
export type ModuleId = z.infer<typeof moduleIdSchema>;

// -------- Niveles y módulos --------

export const levelSchema = z.object({
  id: levelIdSchema,
  order: z.number().int().positive(),
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  prerequisites: z.array(levelIdSchema).default([]),
});
export type Level = z.infer<typeof levelSchema>;

export const moduleSchema = z.object({
  id: moduleIdSchema,
  levelId: levelIdSchema,
  order: z.number().int().positive(),
  title: z.string().min(1).max(100),
  description: z.string().max(500),
});
export type Module = z.infer<typeof moduleSchema>;

// -------- Estados de progreso del usuario --------

export const progressStatusSchema = z.enum(["unstarted", "read", "attempted", "approved"]);
export type ProgressStatus = z.infer<typeof progressStatusSchema>;

export const lessonProgressSchema = z.object({
  lessonId: lessonIdSchema,
  userId: z.string().optional(), // reservado para auth futura; en MVP se usa session/local
  status: progressStatusSchema.default("unstarted"),
  openedAt: z.string().datetime().optional(),
  attemptedAt: z.string().datetime().optional(),
  approvedAt: z.string().datetime().optional(),
  attemptsCount: z.number().int().nonnegative().default(0),
  lastError: z.string().optional(),
});
export type LessonProgress = z.infer<typeof lessonProgressSchema>;

// -------- Ejercicios --------

export const exerciseDifficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export type ExerciseDifficulty = z.infer<typeof exerciseDifficultySchema>;

export const exerciseSchema = z.object({
  id: exerciseIdSchema,
  lessonId: lessonIdSchema,
  title: z.string().min(1).max(120),
  statement: z.string().min(1),
  objectives: z.array(z.string()).min(1),
  difficulty: exerciseDifficultySchema,
  prerequisites: z.array(z.string()).default([]),
  starterCode: z.string().default(""),
  testCases: z.array(z.object({
    id: z.string().min(1),
    input: z.unknown(),
    expected: z.unknown(),
    description: z.string().min(1).max(200),
  })),
  hints: z.array(z.object({
    level: z.number().int().positive().min(1).max(3), // 1 conceptual, 2 concreta, 3 código
    text: z.string().min(1),
  })),
  solution: z.string(), // solo visible tras intento explícito
  acceptanceCriteria: z.array(z.string()).min(1),
});
export type Exercise = z.infer<typeof exerciseSchema>;

// -------- Resultado de prueba de ejercicio --------

export const testResultSchema = z.object({
  exerciseId: exerciseIdSchema,
  passed: z.boolean(),
  output: z.string().optional(),
  error: z.string().optional(),
  executedAt: z.string().datetime(),
});
export type TestResult = z.infer<typeof testResultSchema>;

// -------- Respuesta de API genérica --------

export const apiResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    data: schema.nullable(),
    error: z.string().nullable(),
  });
