// Pruebas del runner: interfaz y valores por defecto
import { describe, it, expect } from "vitest";
import { DEFAULT_RUN_INPUT, runInputSchema } from "./index";

describe("runner contract", () => {
  it("DEFAULT_RUN_INPUT cumple el esquema de entrada", () => {
    const result = runInputSchema.safeParse(DEFAULT_RUN_INPUT);
    expect(result.success).toBe(true);
  });

  it("DEFAULT_RUN_INPUT tiene timeLimitMs y maxOutputChars", () => {
    expect(DEFAULT_RUN_INPUT.timeLimitMs).toBe(5000);
    expect(DEFAULT_RUN_INPUT.maxOutputChars).toBe(5000);
  });
});
