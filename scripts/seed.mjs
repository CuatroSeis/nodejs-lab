import { createPool } from "mysql2/promise";

const pool = createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "nodejs_lab_app",
  password: process.env.DB_PASSWORD ?? "nodejs_lab_app",
  database: process.env.DB_DATABASE ?? "nodejs_lab",
});

const NIVELES = [
  { id: "lvl-1", order: 1, title: "Fundamentos de Node.js", description: "Introducción al runtime, módulos, eventos y el sistema de archivos", prerequisites: [] },
  { id: "lvl-2", order: 2, title: "Asincronía y APIs nativas", description: "Promesas, async/await, fs, path, eventos", prerequisites: ["lvl-1"] },
  { id: "lvl-3", order: 3, title: "HTTP y servidores", description: "Crear servidores con el módulo http y Express", prerequisites: ["lvl-2"] },
  { id: "lvl-4", order: 4, title: "Arquitectura y bases de datos", description: "Patrón MVC, MySQL, consultas parametrizadas", prerequisites: ["lvl-3"] },
  { id: "lvl-5", order: 5, title: "Autenticación y seguridad", description: "JWT, sesiones, hashing de contraseñas, CORS", prerequisites: ["lvl-4"] },
  { id: "lvl-6", order: 6, title: "Testing y calidad", description: "Vitest, Supertest, pruebas de integración", prerequisites: ["lvl-5"] },
  { id: "lvl-7", order: 7, title: "Preparación profesional", description: "Streams, rendimiento, despliegue, entrevistas junior", prerequisites: ["lvl-6"] },
];

const MODULOS = [
  { id: "mod-1-1", levelId: "lvl-1", order: 1, title: "Qué es Node.js y su ecosistema", description: "Runtime, V8, event loop, npm" },
  { id: "mod-1-2", levelId: "lvl-1", order: 2, title: "Sistema de archivos y paths", description: "fs, path, operaciones async" },
  { id: "mod-2-1", levelId: "lvl-2", order: 1, title: "Promesas y async/await", description: "Flujo asíncrono sin callbacks" },
  { id: "mod-3-1", levelId: "lvl-3", order: 1, title: "Servidor HTTP nativo", description: "Módulo http, crear servidores" },
];

const LECCIONES = [
  {
    id: "les-1-1-1",
    levelId: "lvl-1",
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
      analogy: `Imagina un restaurante con un solo mesero. En un modelo tradicional, cada cliente tendría su propio mesero dedicado (un hilo por petición). Si hay 1000 clientes, necesitas 1000 meseros.

Node.js funciona como un mesero único que toma la orden de un cliente, la deja en la cocina y, mientras se prepara, atiende a otro cliente. Cuando la comida está lista, el mesero la entrega. Un solo mesero atiende a muchos clientes porque no espera inactivo mientras se cocina.`,
      example: `// archivo: hola.js
console.log("Hola desde Node.js");

// Ejecutar en terminal:
// node hola.js`,
      lineByLine: `console.log("Hola desde Node.js");
  └─ Llama a la función console.log, disponible globalmente en Node.js.
  └─ Imprime el texto en la terminal (stdout), no en el navegador.`,
      outputPrediction: "Al ejecutar \`node hola.js\`, se imprime en consola:\n\nHola desde Node.js",
      guidedExercise: "Crea un archivo \`saludo.js\` que imprima tu nombre y ejecútalo con \`node saludo.js\`.",
      independentExercise: "Crea un archivo \`datos.js\` que declare tres variables (nombre, ciudad, año) y las imprima con console.log usando interpolación de cadenas.",
      autoTests: "Comprueba que el archivo exista y que contenga al menos una llamada a console.log.",
      progressiveHints: ["Conceptual: Piensa en qué comando imprime texto en la terminal de Node.js.", "Concreta: Usa console.log seguido del texto entre comillas.", "Código: console.log('Mi nombre');"],
      solution: "console.log('Tu nombre aquí');",
      commonErrors: ["Escribir document.write() o window.alert() — no existen en Node.js.", "Olvidar ejecutar con \`node nombre-archivo.js\` en vez de abrir el archivo en el navegador."],
      summary: "Node.js permite ejecutar JavaScript en el servidor usando el motor V8. No hay DOM ni window. Se ejecuta con \`node archivo.js\`.",
      shortEvaluation: "¿Qué motor ejecuta JavaScript en Node.js? Respuesta: V8.",
    },
    exercises: [],
    estimatedMinutes: 25,
  },
  {
    id: "les-1-1-2",
    levelId: "lvl-1",
    moduleId: "mod-1-1",
    order: 2,
    title: "Módulos y require()",
    objective: "Saber crear módulos con module.exports, importarlos con require() y entender el alcance de cada archivo.",
    sections: {
      objective: "Saber crear módulos con module.exports, importarlos con require() y entender el alcance de cada archivo.",
      prerequisites: "Lección 1.1.1 completada. Saber escribir JavaScript básico.",
      explanation: `Node.js usa CommonJS como sistema de módulos por defecto. Cada archivo es un módulo con su propio scope. Las variables y funciones definidas en un archivo no están disponibles en otros a menos que se exporten explícitamente.

Para exportar se usa module.exports o exports. Para importar se usa require('./ruta-al-archivo'). Node resuelve las rutas relativas desde la ubicación del archivo actual, no desde donde se ejecuta el comando node.`,
      analogy: `Imagina que cada archivo es una caja cerrada. Solo lo que pones afuera de la caja (module.exports) puede ser visto por otras cajas. Si no pones nada afuera, el contenido permanece privado.`,
      example: `// archivo: util.js
function suma(a, b) { return a + b; }
module.exports = { suma };

// archivo: index.js
const { suma } = require('./util');
console.log(suma(2, 3)); // 5`,
      lineByLine: `// util.js
function suma(a, b) { ... }
  └─ Define una función privada al módulo.
module.exports = { suma };
  └─ Exporta la función para que otros archivos la puedan usar.

// index.js
const { suma } = require('./util');
  └─ Importa el objeto exportado desde util.js.
console.log(suma(2, 3));
  └─ Usa la función importada.`,
      outputPrediction: "Al ejecutar \`node index.js\` se imprime:\n\n5",
      guidedExercise: "Crea un archivo \`mate.js\` que exporte una función \`duplicar(n)\` que devuelva n * 2. Luego crea \`index.js\` que la importe e imprima el resultado de duplicar(7).",
      independentExercise: "Crea un módulo \`saludos.js\` con dos funciones: \`saludar(nombre)\` y \`despedir(nombre)\`. Exporta ambas e impórtalas en otro archivo para usarlas.",
      autoTests: "Comprobar que se puede importar y ejecutar una función exportada desde otro archivo.",
      progressiveHints: ["Conceptual: Cada archivo es un módulo independiente. Para compartir código hay que exportarlo explícitamente.", "Concreta: Usa module.exports para exportar y require() para importar.", "Código: module.exports = { duplicar }; en un archivo, y const { duplicar } = require('./archivo'); en el otro."],
      solution: `// saludos.js
function saludar(nombre) { return 'Hola, ' + nombre; }
function despedir(nombre) { return 'Adiós, ' + nombre; }
module.exports = { saludar, despedir };`,
      commonErrors: ["Olvidar hacer module.exports y entonces require devuelve {}.", "Usar rutas absolutas en vez de relativas (./) al importar módulos locales.", "Intentar usar import/export sin configurar package.json con type: module."],
      summary: "Cada archivo es un módulo con su propio scope. Se exporta con module.exports y se importa con require(). Las rutas son relativas al archivo actual.",
      shortEvaluation: "¿Qué se usa para importar un módulo en Node.js (CommonJS)? Respuesta: require().",
    },
    exercises: [],
    estimatedMinutes: 30,
  },
  {
    id: "les-1-1-3",
    levelId: "lvl-1",
    moduleId: "mod-1-1",
    order: 3,
    title: "El event loop",
    objective: "Entender el modelo de ejecución basado en eventos de Node.js y por qué no bloquea el hilo principal.",
    sections: {
      objective: "Explicar cómo el event loop permite atender operaciones asíncronas sin bloquear y predecir el orden de ejecución de código sincrónico y asíncrono.",
      prerequisites: "Lecciones 1.1.1 y 1.1.2 completadas. Entender qué es una función y una función de callback.",
      explanation: `Node.js usa un solo hilo para ejecutar JavaScript. Las operaciones de E/S (leer archivos, hacer peticiones de red) se delegan al sistema operativo y, cuando terminan, sus callbacks se encolan en el event loop para ser ejecutados cuando el hilo principal esté libre.

Esto significa que Node.js puede atender muchas operaciones concurrentes sin crear hilos adicionales, pero también que una operación sincrónica pesada (un bucle infinito o un cálculo grande) bloqueará todo el servidor hasta que termine.`,
      analogy: `Un solo mesero en un restaurante: toma pedidos, los deja en la cocina y atiende a otros clientes mientras se prepara la comida. Cuando un plato está listo, lo entrega. El mesero nunca se queda esperando inactivo frente a la cocina.`,
      example: `console.log('1: inicio');
setTimeout(() => console.log('2: temporizador'), 0);
Promise.resolve().then(() => console.log('3: promesa'));
console.log('4: fin');`,
      lineByLine: `console.log('1: inicio');
  └─ Síncrono: se ejecuta inmediatamente.
setTimeout(..., 0);
  └─ Asíncrono: se programa para ejecutarse después, aunque el tiempo sea 0.
Promise.resolve().then(...);
  └─ Asíncrono: se ejecuta tras la cola de microtareas.
console.log('4: fin');
  └─ Síncrono: se ejecuta inmediatamente, antes que los asíncronos.`,
      outputPrediction: "Salida esperada:\n\n1: inicio\n4: fin\n3: promesa\n2: temporizador",
      guidedExercise: "Crea un archivo \`orden.js\` con los cuatro console.log anteriores y ejecútalo. Verifica que el orden sea el predicho.",
      independentExercise: "Crea un archivo que use setTimeout con 100 ms y otro con 0 ms, más un console.log síncrono. Predice y verifica el orden de impresión.",
      autoTests: "Comprobar que el estudiante entiende que el código síncrono se ejecuta antes que los callbacks asíncronos programados con setTimeout(..., 0).",
      progressiveHints: ["Conceptual: El hilo principal termina el código síncrono antes de mirar la cola de tareas asíncronas.", "Concreta: console.log síncrono va primero; setTimeout y promesas van después.", "Código: Los console.log envueltos en setTimeout siempre se imprimen después de los console.log directos."],
      solution: `console.log('1: inicio');
setTimeout(() => console.log('2: temporizador'), 0);
Promise.resolve().then(() => console.log('3: promesa'));
console.log('4: fin');`,
      commonErrors: ["Creer que setTimeout(..., 0) se ejecuta inmediatamente.", "Pensar que Node.js tiene múltiples hilos para JavaScript por defecto.", "Bloquear el event loop con un bucle infinito o fs.readFileSync en archivos grandes."],
      summary: "Node.js tiene un solo hilo para JavaScript. Las operaciones asíncronas se delegan y sus callbacks se ejecutan cuando el hilo está libre. El código síncrono siempre se ejecuta primero.",
      shortEvaluation: "¿Qué se imprime primero: un console.log directo o uno dentro de setTimeout(fn, 0)? Respuesta: el console.log directo.",
    },
    exercises: [],
    estimatedMinutes: 35,
  },
  {
    id: "les-1-2-1",
    levelId: "lvl-1",
    moduleId: "mod-1-2",
    order: 1,
    title: "Leer y escribir archivos con fs",
    objective: "Saber leer y escribir archivos usando el módulo fs de Node.js, con versiones síncronas y asíncronas.",
    sections: {
      objective: "Usar fs.readFile, fs.writeFile y sus versiones promesas (fs.promises) para operar con archivos de forma no bloqueante.",
      prerequisites: "Lección 1.1.2 (módulos y require()) completada. Entender rutas de archivos y callbacks/promesas básicas.",
      explanation: `El módulo fs permite interactuar con el sistema de archivos: leer, escribir, crear, renombrar y eliminar archivos y directorios. Tiene dos estilos de API:

1. Síncrona (bloqueante): fs.readFileSync, fs.writeFileSync. El hilo principal se detiene hasta que termina.
2. Asíncrona (no bloqueante): fs.readFile, fs.writeFile con callbacks, o fs.promises.readFile con async/await. Recomendada para servidores.

Las rutas pueden ser relativas (__dirname) o absolutas.`,
      analogy: `Leer un archivo es como pedir un libro en una biblioteca. La versión síncrona es como quedarte parado en el mostrador esperando a que te entreguen el libro antes de hacer cualquier otra cosa. La versión asíncrona es como dejar tu pedido y seguir leyendo otro libro mientras llega el tuyo.`,
      example: `const fs = require('fs');
const fsPromises = require('fs').promises;

// Asíncrono con promesas (recomendado)
async function leer(ruta) {
  try {
    const data = await fsPromises.readFile(ruta, 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Síncrono (bloqueante)
const data = fs.readFileSync('archivo.txt', 'utf8');`,
      lineByLine: `const fs = require('fs');
  └─ Importa el módulo nativo de sistema de archivos.
const fsPromises = require('fs').promises;
  └─ Versión basada en promesas de fs.
async function leer(ruta) { ... }
  └─ Función asíncrona que puede usar await.
await fsPromises.readFile(ruta, 'utf8');
  └─ Espera la lectura sin bloquear el hilo principal.`,
      outputPrediction: "Depende del contenido del archivo leído. Si el archivo contiene 'Hola mundo', se imprime:\n\nHola mundo",
      guidedExercise: "Crea un archivo \`datos.txt\` con cualquier texto. Luego crea \`leer.js\` que use fs.promises.readFile para leerlo e imprimir su contenido.",
      independentExercise: "Crea un archivo \`copiar.js\` que lea \`origen.txt\` y escriba su contenido en \`destino.txt\` usando fs.promises. Maneja errores con try/catch.",
      autoTests: "Comprobar que el código lee un archivo existente e imprime su contenido, y que maneja el caso de archivo inexistente sin fallar.",
      progressiveHints: ["Conceptual: Usa la versión con promesas (fs.promises) para no bloquear el servidor.", "Concreta: require('fs').promises te da readFile y writeFile basados en promesas.", "Código: await fsPromises.readFile(ruta, 'utf8') dentro de try/catch."],
      solution: `const fsPromises = require('fs').promises;
async function copiar(origen, destino) {
  const contenido = await fsPromises.readFile(origen, 'utf8');
  await fsPromises.writeFile(destino, contenido);
}`,
      commonErrors: ["Usar fs.readFileSync en un servidor: bloquea todo hasta terminar la lectura.", "Olvidar el encoding 'utf8' al leer: devuelve un Buffer en vez de texto.", "No envolver en try/catch: un error de archivo no encontrado crashea el proceso."],
      summary: "El módulo fs permite operar con archivos. Usa la versión asíncrona (fs.promises) para no bloquear el hilo principal de Node.js.",
      shortEvaluation: "¿Qué versión de fs no bloquea el hilo principal? Respuesta: fs.promises (o fs.readFile con callbacks).",
    },
    exercises: [],
    estimatedMinutes: 40,
  },
];

const EJERCICIOS = [
  {
    id: "ex-1-1-1-1",
    lessonId: "les-1-1-1",
    title: "Imprime tu nombre",
    statement: "Escribe un programa que declare tres variables (nombre, ciudad, año) y las imprima usando interpolación de cadenas con console.log.",
    objectives: ["Usar console.log para imprimir en la terminal", "Usar interpolación de cadenas (template literals)", "Declarar variables con const"],
    difficulty: "beginner",
    prerequisites: [],
    starterCode: "// Escribe tu solución aquí\nconst nombre = \"\";\nconst ciudad = \"\";\nconst año = 0;\n\nconsole.log(\"\");",
    acceptanceCriteria: ["El programa imprime los tres valores usando console.log", "Se usan template literals (comillas invertidas) para interpolar", "Las variables se declaran con const"],
    testCases: [
      { id: "tc-1-1-1-1-1", input: null, expected: null, description: "El código se ejecuta sin errores de sintaxis" },
      { id: "tc-1-1-1-1-2", input: null, expected: null, description: "Contiene al menos una llamada a console.log" },
    ],
    hints: [
      { level: 1, text: "Piensa en qué comando imprime texto en la terminal de Node.js." },
      { level: 2, text: "Usa console.log seguido del texto entre comillas invertidas para interpolar variables." },
      { level: 3, text: "console.log(`Hola, me llamo ${nombre} y vivo en ${ciudad}`);" },
    ],
  },
  {
    id: "ex-1-1-2-1",
    lessonId: "les-1-1-2",
    title: "Módulo de saludos",
    statement: "Crea un módulo `saludos.js` con dos funciones: `saludar(nombre)` y `despedir(nombre)`. Exporta ambas con module.exports e impórtalas en otro archivo para usarlas.",
    objectives: ["Exportar funciones con module.exports", "Importar módulos con require()", "Usar funciones importadas"],
    difficulty: "beginner",
    prerequisites: ["Lección 1.1.2"],
    starterCode: "// saludos.js\nfunction saludar(nombre) {\n  return \"Hola, \" + nombre;\n}\nfunction despedir(nombre) {\n  return \"Adiós, \" + nombre;\n}\nmodule.exports = { saludar, despedir };\n\n// index.js (simulado)\nconst { saludar, despedir } = require(\"./saludos\");\nconsole.log(saludar(\"Ana\"));\nconsole.log(despedir(\"Ana\"));",
    acceptanceCriteria: ["El módulo exporta saludar y despedir", "Se importa el módulo con require()", "Se imprimen los resultados de ambas funciones"],
    testCases: [
      { id: "tc-1-1-2-1-1", input: null, expected: null, description: "El módulo se exporta e importa correctamente" },
    ],
    hints: [
      { level: 1, text: "Cada archivo es un módulo independiente. Para compartir código hay que exportarlo explícitamente." },
      { level: 2, text: "Usa module.exports = { saludar, despedir }; para exportar y const { saludar, despedir } = require('./saludos'); para importar." },
      { level: 3, text: "Recuerda que la ruta en require() es relativa al archivo actual (./saludos)." },
    ],
  },
  {
    id: "ex-1-1-3-1",
    lessonId: "les-1-1-3",
    title: "Predice el orden",
    statement: "Escribe un programa que imprima cuatro mensajes en este orden exacto: \"inicio\", \"fin\", \"promesa\", \"temporizador\". Usa console.log directo, setTimeout y Promise.",
    objectives: ["Entender el event loop de Node.js", "Saber que el código síncrono se ejecuta antes que los asíncronos", "Predecir el orden de salida de programas"],
    difficulty: "beginner",
    prerequisites: ["Lección 1.1.3"],
    starterCode: `console.log("inicio");

// Tu código aquí
setTimeout(() => {}, 0);
Promise.resolve().then(() => {});
console.log("fin");`,
    acceptanceCriteria: ["Se imprime \"inicio\" primero", "Se imprime \"fin\" segundo", "Se imprime \"promesa\" tercero", "Se imprime \"temporizador\" último"],
    testCases: [
      { id: "tc-1-1-3-1-1", input: null, expected: null, description: "El orden de salida es correcto" },
    ],
    hints: [
      { level: 1, text: "El código síncrono (console.log directo) siempre se ejecuta antes que las tareas asíncronas." },
      { level: 2, text: "Promise.resolve().then() va en la cola de microtareas y setTimeout en la cola de macrotareas; las microtareas tienen prioridad." },
      { level: 3, text: 'Orden: console.log("inicio"); console.log("fin"); Promise...then(() => console.log("promesa")); setTimeout(() => console.log("temporizador"), 0);' },
    ],
  },
  {
    id: "ex-1-2-1-1",
    lessonId: "les-1-2-1",
    title: "Leer un archivo",
    statement: "Crea un programa que lea el archivo `datos.txt` usando fs.promises.readFile e imprima su contenido. Maneja errores con try/catch.",
    objectives: ["Leer un archivo de forma asíncrona con fs.promises", "Manejar errores con try/catch", "Especificar encoding utf8"],
    difficulty: "beginner",
    prerequisites: ["Lección 1.2.1"],
    starterCode: `const fsPromises = require("fs").promises;

async function leerArchivo(ruta) {
  // Tu código aquí
}

leerArchivo("datos.txt");`,
    acceptanceCriteria: ["Usa fs.promises.readFile para leer el archivo", "Espera el resultado con await", "Envuelve en try/catch para manejar errores", "Especifica \"utf8\" como segundo argumento"],
    testCases: [
      { id: "tc-1-2-1-1-1", input: null, expected: null, description: "El código lee un archivo sin bloquear el hilo principal" },
    ],
    hints: [
      { level: 1, text: "Usa la versión con promesas de fs para no bloquear el servidor." },
      { level: 2, text: "const fsPromises = require(\"fs\").promises; te da readFile basado en promesas." },
      { level: 3, text: 'await fsPromises.readFile(ruta, "utf8") dentro de una función async con try/catch.' },
    ],
  },
];

async function main() {
  await pool.query("SET FOREIGN_KEY_CHECKS=0");
  await pool.query("TRUNCATE TABLE exercise_hints");
  await pool.query("TRUNCATE TABLE exercise_test_cases");
  await pool.query("TRUNCATE TABLE exercises");
  await pool.query("TRUNCATE TABLE lessons");
  await pool.query("TRUNCATE TABLE modules");
  await pool.query("TRUNCATE TABLE levels");
  await pool.query("SET FOREIGN_KEY_CHECKS=1");

  for (const n of NIVELES) {
    await pool.query(
      "INSERT INTO levels (id, order_index, title, description, prerequisites) VALUES (?, ?, ?, ?, ?)",
      [n.id, n.order, n.title, n.description, JSON.stringify(n.prerequisites)]
    );
  }

  for (const m of MODULOS) {
    await pool.query(
      "INSERT INTO modules (id, level_id, order_index, title, description) VALUES (?, ?, ?, ?, ?)",
      [m.id, m.levelId, m.order, m.title, m.description]
    );
  }

  for (const l of LECCIONES) {
    await pool.query(
      "INSERT INTO lessons (id, level_id, module_id, order_index, title, objective, sections, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [l.id, l.levelId, l.moduleId, l.order, l.title, l.objective, JSON.stringify(l.sections), l.estimatedMinutes]
    );
  }

  for (const e of EJERCICIOS) {
    await pool.query(
      "INSERT INTO exercises (id, lesson_id, title, statement, objectives, difficulty, prerequisites, starter_code, acceptance_criteria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [e.id, e.lessonId, e.title, e.statement, JSON.stringify(e.objectives), e.difficulty, JSON.stringify(e.prerequisites), e.starterCode, JSON.stringify(e.acceptanceCriteria)]
    );

    for (const tc of e.testCases) {
      await pool.query(
        "INSERT INTO exercise_test_cases (id, exercise_id, input_json, expected_json, description) VALUES (?, ?, ?, ?, ?)",
        [tc.id, e.id, JSON.stringify(tc.input), JSON.stringify(tc.expected), tc.description]
      );
    }

    for (const h of e.hints) {
      await pool.query(
        "INSERT INTO exercise_hints (id, exercise_id, hint_level, text) VALUES (UUID(), ?, ?, ?)",
        [e.id, h.level, h.text]
      );
    }
  }

  console.log("Seed aplicado correctamente:");
  console.log(`- ${NIVELES.length} niveles`);
  console.log(`- ${MODULOS.length} módulos`);
  console.log(`- ${LECCIONES.length} lecciones`);
  console.log(`- ${EJERCICIOS.length} ejercicios`);
  const totalTestCases = EJERCICIOS.reduce((sum, e) => sum + e.testCases.length, 0);
  const totalHints = EJERCICIOS.reduce((sum, e) => sum + e.hints.length, 0);
  console.log(`- ${totalTestCases} casos de prueba`);
  console.log(`- ${totalHints} pistas`);

  await pool.end();
}

main().catch((err) => {
  console.error("Error aplicando seed:", err);
  process.exit(1);
});
