// Ejemplo de prueba para paquetes compartidos: validación de tipos y esquemas
import { describe, it, expect } from "vitest";
import { lessonSchema, REQUIRED_LESSON_SECTIONS, validateLessonSections } from "./index";

describe("content schemas", () => {
  it("REQUIRED_LESSON_SECTIONS tiene 15 secciones", () => {
    expect(REQUIRED_LESSON_SECTIONS.length).toBe(15);
  });

  it("validateLessonSections detecta secciones faltantes", () => {
    const incomplete: Record<string, string> = { objective: "x" };
    const missing = validateLessonSections(incomplete as any);
    expect(missing.length).toBeGreaterThan(0);
    expect(missing).toContain("explanation");
  });
});
