import { test, expect } from "@playwright/test";

test.describe("Estadísticas", () => {
  test("debe mostrar métricas de progreso", async ({ page }) => {
    await page.goto("/estadisticas");

    await expect(page.locator("h1")).toContainText("Estadísticas");
    await expect(page.locator(".stat-card-label").first()).toContainText("Lecciones aprobadas");
    await expect(page.locator(".stat-card-label").nth(1)).toContainText("Tiempo invertido");
    await expect(page.locator(".stat-card-label").nth(2)).toContainText("Racha actual");
  });

  test("debe mostrar gráfico de actividad", async ({ page }) => {
    await page.goto("/estadisticas");
    await expect(page.locator(".section-title")).toContainText("Actividad reciente");
  });
});
