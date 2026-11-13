# Node.js Lab

Plataforma web interactiva para aprender Node.js progresivamente (fundamentos → backend junior), con lecciones, editor de código, ejercicios ejecutables, evaluaciones y progreso persistente.

## 🎯 Objetivo

Proporcionar un laboratorio de aprendizaje práctico donde los estudiantes puedan:
- Leer lecciones estructuradas con analogías y ejemplos comentados
- Escribir y ejecutar código JavaScript/Node.js en un entorno aislado
- Validar su aprendizaje con pruebas automáticas y evaluaciones cortas
- Rastrear su progreso a través de niveles y módulos
- Repasar conceptos clave y errores frecuentes en una biblioteca de referencia

## 📦 Estructura del monorepo (npm workspaces)

```
nodejs-lab/
├── apps/
│   ├── web/          React 18 + Vite + TypeScript (UI, editor, progreso)
│   └── api/          Express 5 + TypeScript (servidor REST, progreso en MySQL)
├── packages/
│   ├── shared/       Tipos y esquemas Zod compartidos entre web y api
│   ├── content/      Lecciones y ejercicios como datos validados
│   ├── runner/       Ejecutador de ejercicios (Web Worker aislado)
│   └── db/           Pool de conexiones MySQL
├── docs/             Documentación de arquitectura y ADRs
├── e2e/              Tests de extremo a extremo (Playwright)
└── package.json      Scripts raíz y configuración de workspaces
```

## 🚀 Inicio rápido

### Requisitos previos

- Node.js >= 20 (probado con v24.19.0)
- npm >= 10 (probado con v11.17.0)
- MySQL 8.4+ (para persistencia de progreso)

### 1. Clonar e instalar dependencias

```bash
cd nodejs-lab
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de MySQL:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=nodejs_lab_app
DB_PASSWORD=tu_contraseña
DB_DATABASE=nodejs_lab
DB_CONNECTION_LIMIT=10
VITE_API_URL=http://localhost:3001
```

### 3. Crear la base de datos y aplicar el esquema

```bash
# Crear la base de datos
mysql -u root -p -e "CREATE DATABASE nodejs_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Aplicar el esquema SQL
mysql -u root -p nodejs_lab < packages/db/src/schema.sql
```

### 4. Insertar datos de ejemplo

```bash
mysql -u root -p nodejs_lab < scripts/seed.sql
```

*(El archivo `scripts/seed.sql` se puede generar a partir de los datos en `apps/web/src/data/mock.ts`)*

### 5. Ejecutar en desarrollo

```bash
# Ambos (frontend + backend)
npm run dev

# Solo frontend (puerto 5173)
npm run dev:web

# Solo backend (puerto 3001)
npm run dev:api
```

### 6. Ejecutar pruebas

```bash
# Todas las pruebas (unitarias + E2E)
npm test

# Solo pruebas unitarias (Vitest)
npm run test --workspaces --if-present

# Tests E2E (Playwright)
npm run test:e2e --workspace=@nodejs-lab/web

# Verificar tipos (TypeScript)
npm run typecheck

# Verificar lint (ESLint)
npm run lint

# Construir todos los workspaces
npm run build
```

## 🏗️ Arquitectura

### Principios de diseño

1. **Separación de responsabilidades**: contenido, ejecución y aplicación están en paquetes independientes
2. **Ejecución segura**: el código de ejercicios se ejecuta en un Web Worker aislado, sin acceso a Node APIs, red ni sistema de archivos
3. **Datos como contrato**: los tipos y esquemas Zod en `packages/shared` son el único contrato entre frontend y backend
4. **Persistencia progresiva**: `localStorage` en MVP, migración a MySQL en fases posteriores
5. **Sin sobreingeniería**: no se usa auth, Docker ni servicios externos hasta que se demuestre necesidad

### Diagramas de dependencia

```
apps/web ──────► packages/shared  ◄────── apps/api
   │                    ▲                    │
   │                    │                    │
   ▼                    │                    ▼
packages/content    packages/runner     packages/db
   │                    ▲                    │
   └────────────────────┴────────────────────┘
                    MySQL 8.4+
```

## 🧪 Estrategia de pruebas

| Tipo | Herramienta | Alcance |
|------|-------------|---------|
| Unitarias | Vitest | Lógica pura, esquemas Zod, runners |
| Integración | Vitest + Supertest | Endpoints de API, integración web↔api |
| E2E | Playwright | Flujos críticos de usuario en navegador real |

### Comandos de prueba

```bash
npm test              # Todas las pruebas
npm run test:e2e      # Solo E2E (requiere servidores en ejecución)
```

## ♿ Accesibilidad (WCAG 2.1 AA)

La plataforma cumple con los siguientes criterios de accesibilidad:

- **Navegación por teclado**: todos los elementos interactivos son alcanzables con Tab
- **Focus visible**: indicador claro de qué elemento tiene el foco
- **Skip link**: "Saltar al contenido principal" para usuarios de lectores de pantalla
- **Regiones ARIA live**: anuncios de cambios de estado para lectores de pantalla
- **Contraste de colores**: ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **Estructura semántica**: uso correcto de `<main>`, `<nav>`, `<article>`, `<section>`
- **Labels ARIA**: todos los botones y controles tienen etiquetas descriptivas

## 📊 Programa de estudios (7 niveles)

| Nivel | Título | Temas principales |
|-------|--------|-------------------|
| 1 | Fundamentos de Node.js | Runtime, V8, event loop, módulos, require(), npm, fs, path |
| 2 | Asincronía y APIs nativas | Promesas, async/await, eventos, buffers, streams |
| 3 | HTTP y servidores | Módulo http, crear servidores, Express, rutas, middleware |
| 4 | Arquitectura y MySQL | Patrón MVC, controladores, servicios, repositorios, MySQL |
| 5 | Autenticación y seguridad | JWT, sesiones, hashing de contraseñas, CORS, helmet |
| 6 | Testing y calidad | Vitest, Supertest, pruebas de integración, cobertura |
| 7 | Preparación profesional | Proyectos integradores, preparación para entrevistas, despliegue |

Cada nivel contiene módulos, y cada módulo contiene lecciones con la plantilla de 15 secciones.

## 🔒 Seguridad

- Ejecución de código en Web Worker aislado (sin acceso a fs, net, child_process)
- Límites de tiempo y tamaño de salida para prevenir bucles infinitos
- No se almacenan credenciales en el cliente
- Validación de entrada con esquemas Zod en todos los límites
- Sanitización de errores (no se exponen detalles del entorno al usuario)

## 🗺️ Roadmap

| Fase | Objetivo | Estado |
|------|----------|--------|
| Fase 0 | Auditoría y planificación | ✅ Completado |
| Paso 1 | Pantallas base (dashboard, ruta, lección) | ✅ Completado |
| Paso 2 | Editor de código con CodeMirror 6 | ✅ Completado |
| Paso 3 | Frontend conectado al backend (MySQL) | ✅ Completado |
| Paso 4 | Evaluación corta (quiz) por lección | ✅ Completado |
| Paso 5 | Biblioteca de conceptos y errores frecuentes | ✅ Completado |
| Paso 6 | Estadísticas y progreso detallado | ✅ Completado |
| Paso 7 | Migración a MySQL para persistencia | ✅ Completado |
| Paso 8 | Web Worker aislado para ejecución de código | ✅ Completado |
| Paso 9 | Proyectos integradores por nivel | ✅ Completado |
| Paso 10 | Pulido y documentación (WCAG AA, E2E, README, ADRs) | ✅ Completado |

## 📄 Decisiones de arquitectura (ADRs)

Los ADRs se encuentran en `docs/ADR-*.md`:

- **ADR-001**: Monorepo con npm workspaces
- **ADR-002**: Web Worker aislado para ejecución de código
- **ADR-003**: Persistencia con MySQL 8.4
- **ADR-004**: Accesibilidad WCAG 2.1 AA

## 🤝 Contribución

1. Crea una rama desde `main`
2. Implementa los cambios siguiendo las convenciones del repositorio
3. Ejecuta `npm run typecheck`, `npm run lint` y `npm test`
4. Abre un Pull Request describiendo los cambios

## 📄 Licencia

MIT

## 🙏 Agradecimientos

Gracias a la comunidad de Node.js por crear un ecosistema tan rico y accesible para aprender desarrollo backend.
