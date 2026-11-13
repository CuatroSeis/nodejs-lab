import { test, expect } from "@playwright/test";

test.describe("Proyectos integradores", () => {
  test("debe mostrar proyectos por nivel", async ({ page }) => {
    await page.goto("/proyectos");

    await expect(page.locator("h1")).toContainText("Proyectos integradores");
    await expect(page.locator("h2.nivel-title").first()).toContainText("Fundamentos de Node.js");
    await expect(page.locator("h2.nivel-title").nth(1)).toContainText("Asincronía y APIs nativas");
    await expect(page.locator("h2.nivel-title").nth(2)).toContainText("HTTP y servidores");
  });

  test("debe ejecutar un proyecto integrador", async ({ page }) => {
    await page.goto("/proyectos");
    await page.click('.cm-editor');
    await page.keyboard.type("function doble(n) { return n * 2; }\nexport default doble;");
    await page.click('button:has-text("Ejecutar proyecto")');

    await expect(page.locator("text=pruebas aprobadas")).toBeVisible();
  });
});
