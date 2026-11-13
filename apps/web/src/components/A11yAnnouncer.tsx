/**
 * A11yAnnouncer: región ARIA live para anunciar cambios a lectores de pantalla.
 * Útil para anunciar resultados de pruebas, cambios de estado, etc.
 */

import { useEffect, useRef } from "react";

export default function A11yAnnouncer() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      const el = document.createElement("div");
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      el.className = "sr-only";
      document.body.appendChild(el);
      ref.current = el;
    }
    return () => {
      if (ref.current && ref.current.parentNode) {
        ref.current.parentNode.removeChild(ref.current);
        ref.current = null;
      }
    };
  }, []);

  const announce = (message: string) => {
    if (ref.current) {
      ref.current.textContent = "";
      // Pequeño retraso para asegurar que se anuncie incluso si el mensaje es el mismo
      setTimeout(() => {
        ref.current!.textContent = message;
      }, 100);
    }
  };

  return { announce };
}
