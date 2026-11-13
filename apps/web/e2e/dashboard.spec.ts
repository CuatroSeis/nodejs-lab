import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("debe mostrar el título y resumen de progreso", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("Dashboard");
    await expect(page.locator("h2.card-title")).toContainText("Resumen de progreso");
    await expect(page.locator(".stat-label").first()).toContainText("Lecciones");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Aprobadas");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Intentadas");
  });

  test("debe navegar a la ruta de aprendizaje", async ({ page }) => {
    await page.goto("/");
    await page.click('a:has-text("Continuar aprendiendo")');
    await expect(page).toHaveURL("/ruta");
    await expect(page.locator("h1")).toContainText("Ruta de aprendizaje");
  });

  test("debe ser navegable por teclado", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
