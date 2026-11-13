# ADR-003: Persistencia con MySQL 8.4

## Estado

Aceptado

## Contexto

La plataforma necesita persistir el progreso del usuario (lecciones leídas, intentadas, aprobadas), los resultados de pruebas de ejercicios y los días activos para calcular rachas. En el MVP se usó `localStorage`, pero esto tiene limitaciones:

- Los datos se pierden si se borra el caché del navegador
- No se puede acceder desde múltiples dispositivos
- No hay consultas analíticas sobre progreso agregado
- No hay versionado estructurado de los datos

MySQL 8.4 ya está instalado localmente en el entorno de desarrollo, lo que habilita persistencia en base de datos sin infraestructura adicional.

## Decisión

Usar **MySQL 8.4** como base de datos de persistencia para el progreso del usuario y resultados de ejercicios.

Esquema de base de datos con las siguientes tablas:

| Tabla | Propósito |
|-------|-----------|
| `levels` | Niveles del programa (7 niveles definidos) |
| `modules` | Módulos dentro de cada nivel |
| `lessons` | Lecciones con sus 15 secciones como JSON |
| `exercises` | Ejercicios con enunciado, código inicial, pruebas |
| `exercise_test_cases` | Casos de prueba de cada ejercicio |
| `exercise_hints` | Pistas progresivas (niveles 1-3) |
| `lesson_progress` | Progreso de cada lección por usuario |
| `attempt_results` | Resultados de intentos de ejercicios |
| `active_days` | Días con actividad para cálculo de racha |

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Decisión |
|-------------|----------|-------------|----------|
| `localStorage` (MVP inicial) | Simple, sin infraestructura | Datos volátiles, sin consultas analíticas, un solo dispositivo | Usado en MVP, migrado a MySQL |
| SQLite | Sin servidor, archivo único | Menos adecuado para consultas concurrentes, menos herramientas de administración | Rechazada |
| PostgreSQL | Características avanzadas, JSONB | Sobreingeniería para este alcance, no está instalado localmente | Rechazada |
| MySQL 8.4 (seleccionada) | Ya instalada localmente, bien entendida, soporte JSON, buena herramienta de administración | Requiere servidor de base de datos | **Aceptada** |

## Migración desde localStorage

En el MVP, el progreso se almacena en `localStorage` bajo la clave `nodejs-lab-progress:v1`. La migración a MySQL:

1. Lee los datos de `localStorage`
2. Inserta en las tablas `lesson_progress`, `attempt_results`, `active_days`
3. Marca como migrado para no duplicar datos

## Consecuencias

Positivas:
- Datos persistentes y accesibles desde múltiples dispositivos
- Consultas analíticas sobre progreso agregado
- Versionado estructurado de datos
- Copias de seguridad posibles

Negativas:
- Requiere MySQL instalado y configurado
- Mayor complejidad de despliegue (variable de entorno para conexión)
- Necesidad de migraciones de esquema

## Revisión

Revisar al implementar autenticación (Fase futura) para asegurar que el `user_id` se vincule correctamente a las sesiones de usuario autenticadas.
