import { test, expect } from "@playwright/test";

test.describe("Ruta de aprendizaje", () => {
  test("debe mostrar niveles del programa", async ({ page }) => {
    await page.goto("/ruta");

    await expect(page.locator("h1")).toContainText("Ruta de aprendizaje");
    await expect(page.locator("h2.level-section-title").first()).toContainText("Nivel 1: Fundamentos de Node.js");
    await expect(page.locator("h2.level-section-title").nth(1)).toContainText("Nivel 2: Asincronía y APIs nativas");
  });

  test("debe navegar a un módulo", async ({ page }) => {
    await page.goto("/ruta");
    await page.click('a:has-text("Ver módulos")');
    await expect(page.locator("h1")).toContainText("Módulo:");
  });

  test("debe ser accesible por teclado", async ({ page }) => {
    await page.goto("/ruta");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
