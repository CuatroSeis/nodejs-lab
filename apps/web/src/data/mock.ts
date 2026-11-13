// Datos de ejemplo para el MVP (mock temporal, se reemplazará por packages/content).
// Cada nivel sigue el programa de 7 niveles definido en Fase 0.

export const MOCK_LEVELS = [
  {
    id: "level-1",
    order: 1,
    title: "Fundamentos de Node.js",
    description: "Introducción al runtime, módulos, eventos y el sistema de archivos",
    estimatedHours: 4,
    modules: [
      {
        id: "mod-1-1",
        order: 1,
        title: "Qué es Node.js y su ecosistema",
        description: "Runtime, V8, event loop, npm",
        lessons: [
          {
            id: "les-1-1-1",
            order: 1,
            title: "Introducción a Node.js",
            status: "approved",
            estimatedMinutes: 25,
          },
          {
            id: "les-1-1-2",
            order: 2,
            title: "Módulos y require()",
            status: "read",
            estimatedMinutes: 30,
          },
          {
            id: "les-1-1-3",
            order: 2,
            title: "El event loop",
            status: "unstarted",
            estimatedMinutes: 35,
          },
        ],
      },
      {
        id: "mod-1-2",
        order: 2,
        title: "Sistema de archivos y paths",
        description: "fs, path, operaciones async",
        lessons: [
          {
            id: "les-1-2-1",
            order: 1,
            title: "Leer y escribir archivos con fs",
            status: "unstarted",
            estimatedMinutes: 40,
          },
        ],
      },
    ],
  },
  {
    id: "level-2",
    order: 2,
    title: "Asincronía y APIs nativas",
    description: "Promesas, async/await, fs, path, events",
    estimatedHours: 6,
    isLocked: true,
    modules: [
      {
        id: "mod-2-1",
        order: 1,
        title: "Promesas y async/await",
        description: "Flujo asíncrono sin callbacks",
        lessons: [
          {
            id: "les-2-1-1",
            order: 1,
            title: "Promesas en Node.js",
            status: "unstarted",
            estimatedMinutes: 35,
          },
        ],
      },
    ],
  },
  {
    id: "level-3",
    order: 3,
    title: "HTTP y servidores",
    description: "Crear servidores con el módulo http y Express",
    estimatedHours: 8,
    isLocked: true,
    modules: [],
  },
];

// Contenido de una lección de ejemplo (plantilla de 15 secciones).
export const MOCK_LESSON = {
  id: "les-1-1-1",
  levelId: "level-1",
  moduleId: "mod-1-1",
  order: 1,
  title: "Introducción a Node.js",
  objective: "Entender qué es Node.js, cómo se diferencia del navegador y cuándo usarlo.",
  sections: {
    objective: "Al terminar esta lección sabrás explicar qué es Node.js, su modelo de ejecución basado en eventos y por qué permite usar JavaScript en el servidor.",
    prerequisites: "Conocer JavaScript básico (variables, funciones, objetos). No se necesita experiencia previa con Node.js.",
    explanation: `Node.js es un entorno de ejecución para JavaScript fuera del navegador. Está construido sobre el motor V8 de Google (el mismo de Chrome) y añade una capa de APIs para acceder al sistema operativo: archivos, red, procesos, etc.

A diferencia del navegador, donde el código se ejecuta en el hilo principal y el DOM está disponible, en Node.js no hay window, document ni DOM. En su lugar, tienes acceso a process, require, __dirname, __filename y módulos globales del sistema.

El corazón de Node.js es el event loop: un bucle que gestiona operaciones asíncronas sin bloquear el hilo principal. Esto permite atender miles de conexiones concurrentes con un solo hilo de JavaScript.`,
    analogy: `Imagina un restaurante con un solo mesero. En un modelo tradicional (como PHP antiguo), cada cliente tendría su propio mesero dedicado (un hilo por petición). Si hay 1000 clientes, necesitas 1000 meseros. 

Node.js funciona como un mesero único que toma la orden de un cliente, la deja en la cocina y, mientras se prepara, atiende a otro cliente. Cuando la comida está lista, el mesero la entrega. Un solo mesero atiende a muchos clientes porque no espera inactivo mientras se cocina.`,
    example: `// archivo: hola.js
console.log("Hola desde Node.js");

// Ejecutar en terminal:
// node hola.js`,
    lineByLine: `console.log("Hola desde Node.js");
      └─ Llama a la función console.log, disponible globalmente en Node.js.
      └─ Imprime el texto en la terminal (stdout), no en el navegador.`,
    outputPrediction: "Al ejecutar `node hola.js`, se imprime en consola:\n\nHola desde Node.js",
    guidedExercise: "Crea un archivo `saludo.js` que imprima tu nombre y ejecútalo con `node saludo.js`.",
    independentExercise: "Crea un archivo `datos.js` que declare tres variables (nombre, ciudad, año) y las imprima con console.log usando interpolación de cadenas.",
    autoTests: "Comprueba que el archivo exista y que contenga al menos una llamada a console.log.",
    progressiveHints: [
      "Conceptual: Piensa en qué comando imprime texto en la terminal de Node.js.",
      "Concreta: Usa console.log seguido del texto entre comillas.",
      "Código: console.log('Mi nombre');",
    ],
    solution: "console.log('Tu nombre aquí');",
    commonErrors: [
      "Escribir document.write() o window.alert() — no existen en Node.js.",
      "Olvidar ejecutar con `node nombre-archivo.js` en vez de abrir el archivo en el navegador.",
    ],
    summary: "Node.js permite ejecutar JavaScript en el servidor usando el motor V8. No hay DOM ni window. Se ejecuta con `node archivo.js`.",
    shortEvaluation: "¿Qué motor ejecuta JavaScript en Node.js? Respuesta: V8.",
  },
  exercises: [],
  estimatedMinutes: 25,
};
