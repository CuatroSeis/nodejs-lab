// Utilidades de accesibilidad (WCAG 2.1 AA)
// Proporciona helpers para asegurar contraste, navegación por teclado y ARIA.

export const A11Y_LABELS = {
  runButton: "Ejecutar código",
  toggleOutput: "Mostrar u ocultar salida de pruebas",
  toggleSolution: "Mostrar u ocultar solución explicada",
  lessonCard: (title: string) => `Lección: ${title}`,
  levelCard: (title: string) => `Nivel: ${title}`,
  sidebarNav: "Navegación principal del laboratorio de Node.js",
  breadcrumb: (label: string) => `Volver a ${label}`,
};

export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const c = hex.replace("#", "");
    const rgb = c.match(/../g)!.map((x) => parseInt(x, 16) / 255);
    const srgb = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function meetsWCAGAA(color1: string, color2: string, largeText = false): boolean {
  const ratio = getContrastRatio(color1, color2);
  return largeText ? ratio >= 3 : ratio >= 4.5;
}
