import { test, expect } from "@playwright/test";

test.describe("Biblioteca de conceptos", () => {
  test("debe mostrar conceptos y errores frecuentes", async ({ page }) => {
    await page.goto("/conceptos");

    await expect(page.locator("h1")).toContainText("Biblioteca de conceptos");
    await expect(page.locator("h2.section-title").first()).toContainText("Conceptos clave");
    await expect(page.locator("h2.section-title").nth(1)).toContainText("Errores frecuentes");
  });

  test("debe ser navegable por teclado", async ({ page }) => {
    await page.goto("/conceptos");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
