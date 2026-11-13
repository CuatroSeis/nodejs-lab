/**
 * FocusManager: gestiona el foco de teclado para accesibilidad.
 * Útil para diálogos, modales y paneles que requieren trampa de foco.
 */

import { useEffect, useCallback } from "react";

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive || e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    },
    [containerRef, isActive]
  );

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, handleKeyDown]);
}

export function useInitialFocus(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const focusable = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable?.focus();
  }, [containerRef, isActive]);
}
