# ADR-002: Web Worker aislado para ejecución de código

## Estado

Aceptado

## Contexto

La plataforma necesita ejecutar código JavaScript proporcionado por el usuario (soluciones a ejercicios y proyectos integradores). Ejecutar este código en el proceso principal del backend o en el hilo principal del frontend implica riesgos de seguridad:

- Ejecución de código malicioso (bucles infinitos, consumo excesivo de CPU/memoria)
- Acceso al sistema de archivos (`fs`)
- Acceso a la red (`net`, `http`, `fetch`)
- Acceso a credenciales y variables de entorno
- Creación de procesos persistentes (`child_process`)

Además, el backend es una única instancia Express que no puede permitirse bloquearse por un solo usuario.

## Decisión

Ejecutar el código de ejercicios en un **Web Worker aislado** creado mediante `Blob URL` desde el frontend. El Worker:

1. Ejecuta el código usando `new Function()` con un scope restringido (globales seguros solo)
2. No tiene acceso a `fs`, `net`, `child_process`, `process.env`, etc.
3. Tiene un límite de tiempo configurable por caso de prueba (5000 ms por defecto)
4. Tiene un límite de tamaño de salida configurable (5000 caracteres por defecto)
5. Si excede los límites, se reporta un error sin exponer detalles del entorno

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Decisión |
|-------------|----------|-------------|----------|
| Ejecutar en el hilo principal del frontend | Simple, sin infraestructura adicional | Bloquea la UI, sin límites de tiempo, sin aislamiento real | Rechazada |
| Ejecutar en el backend (Node.js) | Control completo, límites de servidor | Riesgo de seguridad alto, requiere sandbox pesado (Docker, gVisor), sobreingeniería para MVP | Rechazada |
| Ejecutar en un servicio separado (serverless) | Aislamiento completo | Sobreingeniería para MVP, costo adicional, latencia de red | Rechazada |
| Web Worker aislado (seleccionada) | Aislamiento de hilo, sin acceso a Node APIs, límites de tiempo/salida, sin infraestructura adicional | Solo lógica JS pura (no hay APIs de Node como `fs`, `http`) | **Aceptada** |

## Limitaciones conocidas

- Solo se puede ejecutar lógica JavaScript pura. No hay acceso a APIs de Node.js (`fs`, `http`, `events`, etc.)
- Para enseñar conceptos de `fs` o `http`, se usa "predicción de salida" (el estudiante predice qué imprimiría el código sin ejecutarlo realmente)
- No hay sandbox de servidor; la seguridad depende del scope restringido y los límites de tiempo/salida

## Consecuencias

Positivas:
- Ejecución aislada que no bloquea la UI ni el servidor
- Sin infraestructura adicional (no requiere Docker, gVisor, etc.)
- Fácil de desplegar y mantener

Negativas:
- No se pueden ejecutar ejemplos que usen APIs de Node.js en tiempo real
- Se requiere documentación clara sobre las limitaciones del entorno de ejecución

## Revisión

Revisar al implementar el Paso 8 (migración completa a Web Worker) para evaluar si es necesario un sandbox de servidor para niveles avanzados (nivel 4+).
