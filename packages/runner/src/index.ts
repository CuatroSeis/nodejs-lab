// Contrato del runner de ejercicios.
// En MVP se ejecuta en un Web Worker aislado (lógica JS pura, sin Node APIs, sin red, sin fs).
// Toda entrada y salida se valida con esquemas estrictos.

import { z } from "zod";

export const runInputSchema = z.object({
  code: z.string().max(10000),
  testCases: z.array(z.object({
    id: z.string().min(1),
    input: z.unknown(),
    expected: z.unknown(),
  })),
  timeLimitMs: z.number().int().positive().default(5000),
  maxOutputChars: z.number().int().positive().default(5000),
});
export type RunInput = z.infer<typeof runInputSchema>;

export const runOutputSchema = z.object({
  testCaseId: z.string().min(1),
  passed: z.boolean(),
  output: z.string().optional(),
  error: z.string().optional(),
  executionTimeMs: z.number().int().nonnegative(),
  timedOut: z.boolean().default(false),
});
export type RunOutput = z.infer<typeof runOutputSchema>;

export interface ExerciseRunner {
  run(input: RunInput): Promise<RunOutput[]>;
}

// Referencia explícita para evitar falso positivo de no-unused-vars en tipos.
const _runOutputType: RunOutput | undefined = undefined;

export const DEFAULT_RUN_INPUT: RunInput = {
  code: "",
  testCases: [],
  timeLimitMs: 5000,
  maxOutputChars: 5000,
};
