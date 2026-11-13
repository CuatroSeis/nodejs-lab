// Proyectos integradores por nivel.
// Cada proyecto combina los conceptos aprendidos en un nivel y se ejecuta
// en el Web Worker aislado (lógica JS pura, sin APIs de Node como fs/http).

export type IntegratorLevel = "level-1" | "level-2" | "level-3";

export interface IntegratorProject {
  id: string;
  level: IntegratorLevel;
  levelTitle: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  starterCode: string;
  testCases: Array<{
    id: string;
    input: unknown;
    expected: unknown;
    description: string;
  }>;
  hints: Array<{ level: number; text: string }>;
  solution: string;
  acceptanceCriteria: string[];
  concepts: string[]; // conceptos clave que se ponen en práctica
}

export const INTEGRATOR_PROJECTS: IntegratorProject[] = [
  {
    id: "proj-1-1",
    level: "level-1",
    levelTitle: "Nivel 1: Fundamentos de Node.js",
    title: "Calculadora de métricas de código",
    description: `Implementa una función que reciba el código fuente de un archivo JavaScript como cadena y devuelva métricas básicas: número de líneas, número de funciones declaradas y número de variables declaradas con const/let/var.

Este proyecto integra:
- Manejo de strings y operaciones de texto
- Expresiones regulares para detectar patrones
- Estructuras de datos (objetos para agrupar métricas)
- Módulos (export/import conceptual)`,
    estimatedMinutes: 45,
    starterCode: `// Escribe una función que analice código JavaScript y devuelva métricas.
// Recibe: código fuente como string
// Retorna: objeto con líneas, funciones y variables

function analizarCodigo(codigo) {
  // Tu implementación aquí
  return {
    lineas: 0,
    funciones: 0,
    variables: 0,
  };
}

export default analizarCodigo;`,
    testCases: [
      {
        id: "tc-1",
        input: "const a = 1;\nfunction suma(x, y) { return x + y; }\nlet b = 2;",
        expected: { lineas: 3, funciones: 1, variables: 2 },
        description: "Código simple con 1 función y 2 variables",
      },
      {
        id: "tc-2",
        input: "",
        expected: { lineas: 0, funciones: 0, variables: 0 },
        description: "Código vacío",
      },
      {
        id: "tc-3",
        input: "var x = 10;\nvar y = 20;\nfunction foo() {}\nfunction bar() {}\nconst z = 30;",
        expected: { lineas: 5, funciones: 2, variables: 3 },
        description: "Múltiples variables y funciones",
      },
    ],
    hints: [
      {
        level: 1,
        text: "Divide el código por líneas con .split('\\n') y cuenta la longitud del array resultante.",
      },
      {
        level: 2,
        text: "Usa una expresión regular como /function\\s+\\w+/g para encontrar declaraciones de función.",
      },
      {
        level: 3,
        text: "Usa /(?:const|let|var)\\s+\\w+/g para encontrar declaraciones de variables. Cuenta los coincidencias con .match().",
      },
    ],
    solution: `function analizarCodigo(codigo) {
  const lineas = codigo.split("\\n").length;
  const funciones = (codigo.match(/function\\s+\\w+/g) || []).length;
  const variables = (codigo.match(/(?:const|let|var)\\s+\\w+/g) || []).length;
  return { lineas, funciones, variables };
}`,
    acceptanceCriteria: [
      "La función analizarCodigo recibe un string y devuelve un objeto con propiedades lineas, funciones y variables",
      "Cuenta correctamente líneas, funciones y variables en código simple",
      "Maneja código vacío retornando ceros",
    ],
    concepts: ["strings", "expresiones regulares", "objetos", "funciones"],
  },
  {
    id: "proj-2-1",
    level: "level-2",
    levelTitle: "Nivel 2: Asincronía y APIs nativas",
    title: "Procesador de tareas asíncronas",
    description: `Implementa una función que procese un array de "tareas" asíncronas. Cada tarea es un objeto con un id y un tiempo de retraso (ms). La función debe ejecutar todas las tareas CONCURRENTEMENTE (no secuencialmente) y devolver un array con los resultados en el mismo orden que las entradas.

Este proyecto integra:
- Promesas y async/await
- setTimeout para simular operaciones asíncronas
- Promise.all para ejecución concurrente
- Manejo de errores en promesas`,
    estimatedMinutes: 50,
    starterCode: `// Procesa tareas asíncronas de forma concurrente.
// Cada tarea: { id: string, delayMs: number }
// Retorna: array de resultados en el mismo orden de entrada

async function procesarTareas(tareas) {
  // Tu implementación aquí
  return [];
}

export default procesarTareas;`,
    testCases: [
      {
        id: "tc-1",
        input: [
          { id: "t1", delayMs: 10 },
          { id: "t2", delayMs: 5 },
          { id: "t3", delayMs: 20 },
        ],
        expected: [
          { id: "t1", delayMs: 10, completada: true },
          { id: "t2", delayMs: 5, completada: true },
          { id: "t3", delayMs: 20, completada: true },
        ],
        description: "3 tareas concurrentes, se resuelven en orden de entrada",
      },
      {
        id: "tc-2",
        input: [],
        expected: [],
        description: "Array vacío de tareas",
      },
    ],
    hints: [
      {
        level: 1,
        text: "Usa Promise.all() para ejecutar todas las tareas al mismo tiempo en lugar de una tras otra.",
      },
      {
        level: 2,
        text: "Crea una promesa por tarea que use setTimeout y se resuelva con la tarea marcada como completada.",
      },
      {
        level: 3,
        text: "Mapea el array de tareas a un array de promesas, luego pasa ese array a Promise.all().",
      },
    ],
    solution: `async function procesarTareas(tareas) {
  const promesas = tareas.map((tarea) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...tarea, completada: true });
      }, tarea.delayMs);
    });
  });
  return Promise.all(promesas);
}`,
    acceptanceCriteria: [
      "Las tareas se ejecutan concurrentemente (el tiempo total es el delay máximo, no la suma)",
      "Los resultados se devuelven en el mismo orden que las entradas",
      "Maneja array vacío retornando un array vacío",
    ],
    concepts: ["promesas", "async/await", "Promise.all", "setTimeout"],
  },
  {
    id: "proj-3-1",
    level: "level-3",
    levelTitle: "Nivel 3: HTTP y servidores",
    title: "Enrutador de API simulado",
    description: `Implementa un enrutador simple que reciba una "solicitud" (método HTTP y ruta) y devuelva una "respuesta" (código de estado y cuerpo). El enrutador debe registrar rutas con un método y una ruta, y luego buscar la ruta coincidente para una solicitud dada.

Nota: Este proyecto simula la lógica de un servidor HTTP sin usar el módulo http de Node.js (que no está disponible en el entorno de ejecución aislado). Los conceptos de métodos, rutas, códigos de estado y cuerpos de respuesta son los mismos.

Este proyecto integra:
- Métodos HTTP (GET, POST, PUT, DELETE)
- Rutas y path matching
- Códigos de estado HTTP (200, 404, 405)
- Objetos de solicitud y respuesta`,
    estimatedMinutes: 55,
    starterCode: `// Enrutador HTTP simplificado.
// register(method, path, handler) registra una ruta.
// handle(method, path) busca y ejecuta el handler, o devuelve 404/405.

class Enrutador {
  constructor() {
    this.rutas = [];
  }

  registrar(method, path, handler) {
    // Tu implementación aquí
  }

  manejar(method, path) {
    // Tu implementación aquí
    return { status: 404, cuerpo: "No encontrado" };
  }
}

export default Enrutador;`,
    testCases: [
      {
        id: "tc-1",
        input: {
          acciones: [
            ["registrar", "GET", "/usuarios", (req: { method: string; path: string }) => ({ cuerpo: "Lista de usuarios" })],
            ["registrar", "POST", "/usuarios", (req: { method: string; path: string }) => ({ cuerpo: "Usuario creado" })],
            ["manejar", "GET", "/usuarios"],
            ["manejar", "POST", "/usuarios"],
            ["manejar", "GET", "/productos"],
            ["manejar", "PUT", "/usuarios"],
          ],
        },
        expected: [
          { status: 200, cuerpo: "Lista de usuarios" },
          { status: 200, cuerpo: "Usuario creado" },
          { status: 404, cuerpo: "No encontrado" },
          { status: 405, cuerpo: "Método no permitido" },
        ],
        description: "Registro y manejo de rutas con diferentes métodos",
      },
    ],
    hints: [
      {
        level: 1,
        text: "Guarda cada ruta registrada como un objeto con method, path y handler en un array.",
      },
      {
        level: 2,
        text: "En manejar(), busca primero si existe alguna ruta con ese path (sea cual sea el método). Si no existe, devuelve 404.",
      },
      {
        level: 3,
        text: "Si existe el path pero con un método diferente, devuelve 405. Si coincide method y path, ejecuta el handler y devuelve 200 con su cuerpo.",
      },
    ],
    solution: `class Enrutador {
  constructor() {
    this.rutas = [];
  }

  registrar(method, path, handler) {
    this.rutas.push({ method, path, handler });
  }

  manejar(method, path) {
    const rutaExistente = this.rutas.find((r) => r.path === path);
    if (!rutaExistente) {
      return { status: 404, cuerpo: "No encontrado" };
    }
    const rutaExacta = this.rutas.find((r) => r.path === path && r.method === method);
    if (!rutaExacta) {
      return { status: 405, cuerpo: "Método no permitido" };
    }
    return { status: 200, cuerpo: rutaExacta.handler({ method, path }).cuerpo };
  }
}`,
    acceptanceCriteria: [
      "register() guarda rutas con método, path y handler",
      "handle() devuelve 200 y el cuerpo del handler cuando coinciden method y path",
      "handle() devuelve 404 cuando no existe ninguna ruta con ese path",
      "handle() devuelve 405 cuando existe el path pero con otro método",
    ],
    concepts: ["métodos HTTP", "rutas", "códigos de estado", "objetos de solicitud/respuesta"],
  },
];
