import { test, expect } from "@playwright/test";

test.describe("Lección y ejercicio", () => {
  test("debe navegar a una lección y mostrar su contenido", async ({ page }) => {
    await page.goto("/ruta");
    await page.click('a:has-text("Ver módulos")');
    await page.click('button:has-text("Iniciar")');

    await expect(page.locator("h1")).toContainText("Introducción a Node.js");
    await expect(page.locator("h2")).toContainText("Objetivo");
  });

  test("debe ejecutar código de ejercicio y mostrar resultados", async ({ page }) => {
    await page.goto("/leccion/les-1-1-1/ejercicio");

    await expect(page.locator("h1")).toContainText("Ejercicio de código");
    await page.click('.cm-editor');
    await page.keyboard.type("function doble(n) { return n * 2; }\nexport default doble;");
    await page.click('button:has-text("Ejecutar código")');

    await expect(page.locator("text=pruebas aprobadas")).toBeVisible();
  });

  test("debe navegar a la evaluación", async ({ page }) => {
    await page.goto("/leccion/les-1-1-1");
    await page.click('a:has-text("Ir a la evaluación")');
    await expect(page.locator("h1")).toContainText("Evaluación corta");
  });
});
