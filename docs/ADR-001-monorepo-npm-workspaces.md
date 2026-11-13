# ADR-001: Monorepo con npm workspaces

## Estado

Aceptado

## Contexto

El proyecto necesita separar claramente tres capas con ciclos de cambio distintos:
1. **Contenido educativo** (lecciones, ejercicios, pruebas): cambia frecuentemente, independiente del código.
2. **Ejecución de ejercicios**: pieza de mayor riesgo de seguridad, debe estar aislada.
3. **Aplicación** (frontend + backend): consume contenido y expone progreso.

También se requiere compartir tipos y esquemas de validación entre frontend y backend sin duplicar código.

## Decisión

Usar un monorepo con npm workspaces (ya disponible en npm 11, no añade herramienta nueva):

- `apps/web` — React 19 + Vite + TypeScript
- `apps/api` — Express 5 + TypeScript
- `packages/shared` — tipos + esquemas Zod compartidos
- `packages/content` — lecciones y ejercicios como datos validados
- `packages/runner` — evaluación de ejercicios (Web Worker)

## Alternativas consideradas

- **Repositorios separados**: mayor fricción para compartir tipos y contenido; descartado.
- **Nx / Turborepo**: sobreingeniería para este alcance; descartado.
- **Monorepo con pnpm/yarn workspaces**: npm ya lo soporta nativamente; descartado para no añadir gestor de paquetes.

## Consecuencias

Positivas:
- Un solo `package.json` raíz, instalación con un comando.
- Tipos compartidos sin duplicación.
- Fácil migrar un paquete a su propio repo en el futuro.

Negativas:
- Configuración de builds y tests ligeramente más compleja que un solo proyecto.
- Riesgo de acoplar paquetes si no se respetan los límites de importación.

## Revisión

Revisar al pasar a Fase 3 (ejecución segura) si `packages/runner` debe moverse a un servicio separado.
