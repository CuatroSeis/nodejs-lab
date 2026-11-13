import { describe, it, expect } from "vitest";
import { levelSchema, exerciseSchema, lessonProgressSchema } from "./index";

describe("shared schemas", () => {
  it("levelSchema valida un nivel completo", () => {
    const result = levelSchema.safeParse({
      id: "lvl-1",
      order: 1,
      title: "Fundamentos",
      description: "Intro a Node.js",
      prerequisites: [],
    });
    expect(result.success).toBe(true);
  });

  it("lessonProgressSchema default status es unstarted", () => {
    const result = lessonProgressSchema.safeParse({
      lessonId: "les-1",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("unstarted");
  });

  it("exerciseSchema valida un ejercicio completo", () => {
    const result = exerciseSchema.safeParse({
      id: "ex-1",
      lessonId: "les-1",
      title: "Mi primer ejercicio",
      statement: "Escribe una función que sume dos números.",
      objectives: ["Entender función"],
      difficulty: "beginner",
      prerequisites: [],
      starterCode: "function sum(a, b) {}\n",
      testCases: [
        { id: "tc-1", input: [1, 2], expected: 3, description: "1 + 2 = 3" },
      ],
      hints: [{ level: 1, text: "Usa return a + b" }],
      solution: "function sum(a, b) { return a + b; }",
      acceptanceCriteria: ["La función retorna la suma de a y b"],
    });
    expect(result.success).toBe(true);
  });
});
