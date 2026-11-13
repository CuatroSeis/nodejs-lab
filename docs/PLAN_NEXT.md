# Node.js Lab

Este repositorio contiene el esqueleto inicial (Fase 0) del monorepo.

## Estructura

- `apps/web` — frontend React + Vite + TypeScript
- `apps/api` — backend Express 5 + TypeScript
- `packages/shared` — tipos y esquemas Zod compartidos
- `packages/content` — lecciones y ejercicios como datos
- `packages/runner` — evaluador de ejercicios (Web Worker)
- `docs/` — arquitectura y decisiones (ADRs)

## Scripts

Desde la raíz:

```
npm install            # instala dependencias de todos los workspaces
npm run dev:web        # frontend en http://localhost:5173
npm run dev:api        # backend en http://localhost:3001
npm run dev            # ambos en paralelo
npm run build          # build de todos los workspaces
npm test               # pruebas de todos los workspaces
npm run lint           # lint de todos los workspaces
npm run typecheck      # verificación de tipos
```

## Estado actual

Fase 0 completada: esqueleto del monorepo, contratos de datos, servidor base y pruebas de humo.

Siguiente paso propuesto: instalar dependencias y desarrollar las pantallas principales (dashboard, ruta de aprendizaje, lección, editor) pendiente de tu aprobación.
