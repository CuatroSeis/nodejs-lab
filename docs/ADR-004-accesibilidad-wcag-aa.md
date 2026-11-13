# ADR-004: Accesibilidad WCAG 2.1 AA

## Estado

Aceptado

## Contexto

La plataforma es una herramienta educativa que debe ser accesible para todos los usuarios, incluidas personas con discapacidades visuales, motoras o cognitivas. WCAG 2.1 AA es el estándar de accesibilidad web más ampliamente adoptado.

## Decisión

Implementar accesibilidad WCAG 2.1 AA en todos los componentes de la interfaz de usuario.

### Criterios implementados

| Criterio WCAG | Implementación |
|---------------|----------------|
| 1.4.3 Contraste (mínimo) | Ratio 4.5:1 para texto normal, 3:1 para texto grande. Colores definidos en variables CSS con verificación de contraste |
| 2.1.1 Teclado | Toda funcionalidad operatable mediante teclado (Tab, Enter, Espacio) |
| 2.4.7 Focus visible | Indicador claro de qué elemento tiene el foco (outline 2px color acento) |
| 2.4.1 Bloques para saltar | Skip link "Saltar al contenido principal" al inicio de cada página |
| 4.1.2 Nombre, rol, valor | Todos los controles tienen nombres accesibles (aria-label, title, texto visible) |
| 4.1.3 Mensajes de estado | Región ARIA live para anunciar cambios (resultados de pruebas, cambios de estado) |

### Componentes de accesibilidad creados

| Componente | Propósito |
|------------|-----------|
| `A11ySkipLink` | Enlace para saltar contenido repetitivo |
| `FocusManager` | Gestión de trampa de foco y foco inicial |
| `A11yAnnouncer` | Región ARIA live para anuncios a lectores de pantalla |
| `a11y.ts` | Utilidades de cálculo de contraste y verificación WCAG AA |

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Decisión |
|-------------|----------|-------------|----------|
| No implementar accesibilidad | Menor tiempo de desarrollo | Excluye usuarios con discapacidades, incumple estándares legales en muchas jurisdicciones | Rechazada |
| Implementar solo parcialmente | Más rápido | Deja brechas de accesibilidad que impiden el uso completo | Rechazada |
| WCAG 2.1 AA (seleccionada) | Estándar ampliamente adoptado, equilibra accesibilidad y esfuerzo de implementación | Requiere revisión continua de nuevos componentes | **Aceptada** |

## Herramientas de verificación

- Pruebas manuales con teclado (Tab, Enter, Espacio)
- Pruebas con lectores de pantalla (NVDA, VoiceOver)
- Verificación de contraste con herramientas como WebAIM Contrast Checker
- Pruebas E2E con Playwright que verifican navegación por teclado

## Revisión

Revisar cada vez que se agreguen nuevos componentes interactivos para asegurar que cumplan con WCAG 2.1 AA.
