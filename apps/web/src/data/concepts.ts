// Datos de conceptos y errores frecuentes para la biblioteca de aprendizaje.
// En fases siguientes estos datos vendrán de packages/content o MySQL.

export type ConceptCategory = "fundamentos" | "asincronia" | "http" | "modulos" | "sistema-archivos";

export interface Concept {
  id: string;
  title: string;
  category: ConceptCategory;
  description: string;
  codeExample: string;
  relatedLessons: string[];
}

export interface CommonError {
  id: string;
  title: string;
  category: ConceptCategory;
  description: string;
  wrongCode: string;
  correctCode: string;
  whyItHappens: string;
  relatedLessons: string[];
}

export const CONCEPTS: Concept[] = [
  {
    id: "concept-node-what",
    title: "¿Qué es Node.js?",
    category: "fundamentos",
    description: "Node.js es un entorno de ejecución para JavaScript fuera del navegador, construido sobre el motor V8 de Google. Permite usar JavaScript en el servidor para construir aplicaciones de red escalables.",
    codeExample: "// Ejecutar desde la terminal:\nnode archivo.js\n\n// Node.js tiene acceso a APIs del sistema operativo:\nconsole.log(process.platform); // 'linux'\nconsole.log(process.version);    // 'v24.19.0'",
    relatedLessons: ["les-1-1-1"],
  },
  {
    id: "concept-event-loop",
    title: "Event Loop",
    category: "fundamentos",
    description: "El event loop es el mecanismo que permite a Node.js manejar operaciones asíncronas sin bloquear el hilo principal. A diferencia de otros entornos, Node.js usa un solo hilo para JavaScript y delega operaciones de E/S al sistema operativo.",
    codeExample: "console.log('1: inicio');\nsetTimeout(() => console.log('2: temporizador'), 0);\nPromise.resolve().then(() => console.log('3: promesa'));\nconsole.log('4: fin');\n\n// Salida esperada:\n// 1: inicio\n// 4: fin\n// 3: promesa\n// 2: temporizador",
    relatedLessons: ["les-1-1-3"],
  },
  {
    id: "concept-modules",
    title: "Módulos y require()",
    category: "modulos",
    description: "Node.js usa CommonJS como sistema de módulos por defecto. Cada archivo es un módulo con su propio scope. Se exporta con module.exports y se importa con require().",
    codeExample: "// archivo: util.js\nfunction suma(a, b) { return a + b; }\nmodule.exports = { suma };\n\n// archivo: index.js\nconst { suma } = require('./util');\nconsole.log(suma(2, 3)); // 5",
    relatedLessons: ["les-1-1-2"],
  },
  {
    id: "concept-fs",
    title: "Sistema de archivos (fs)",
    category: "sistema-archivos",
    description: "El módulo fs permite leer, escribir, crear y eliminar archivos. Tiene versiones síncronas (fs.readFileSync) y asíncronas (fs.readFile, fs.promises.readFile).",
    codeExample: "const fs = require('fs');\nconst fsPromises = require('fs').promises;\n\n// Síncrono (bloqueante)\nconst data = fs.readFileSync('archivo.txt', 'utf8');\n\n// Asíncrono (no bloqueante)\nfsPromises.readFile('archivo.txt', 'utf8')\n  .then(data => console.log(data))\n  .catch(err => console.error(err));",
    relatedLessons: ["les-1-2-1"],
  },
  {
    id: "concept-promises",
    title: "Promesas y async/await",
    category: "asincronia",
    description: "Una promesa representa un valor que estará disponible en el futuro. async/await es azúcar sintáctico sobre promesas que permite escribir código asíncrono de forma secuencial.",
    codeExample: "async function leerArchivo(ruta) {\n  try {\n    const data = await fsPromises.readFile(ruta, 'utf8');\n    console.log(data);\n  } catch (err) {\n    console.error('Error:', err.message);\n  }\n}",
    relatedLessons: ["les-2-1-1"],
  },
  {
    id: "concept-http",
    title: "Servidores HTTP",
    category: "http",
    description: "El módulo http permite crear servidores web en Node.js. Un servidor escucha peticiones en un puerto y envía respuestas al cliente.",
    codeExample: "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hola desde Node.js');\n});\n\nserver.listen(3000, () => {\n  console.log('Servidor en http://localhost:3000');\n});",
    relatedLessons: ["les-3-1-1"],
  },
];

export const COMMON_ERRORS: CommonError[] = [
  {
    id: "error-window-node",
    title: "Usar window o document en Node.js",
    category: "fundamentos",
    description: "window y document son objetos del navegador (DOM). No existen en Node.js, lo que causa un ReferenceError al intentar usarlos.",
    wrongCode: "console.log(window.location);\n// ReferenceError: window is not defined",
    correctCode: "console.log(process.cwd());\n// En Node.js usa process, no window",
    whyItHappens: "Node.js no tiene un navegador ni DOM. Ejecuta JavaScript en el servidor con acceso al sistema operativo, no a la interfaz de usuario del navegador.",
    relatedLessons: ["les-1-1-1"],
  },
  {
    id: "error-forget-node",
    title: "Olvidar ejecutar con node",
    category: "fundamentos",
    description: "Abrir un archivo .js directamente en el navegador no ejecuta código de Node.js. Debes usar el comando node en la terminal.",
    wrongCode: "// Abrir archivo.js en el navegador\n// No imprime nada en consola del servidor",
    correctCode: "// Terminal:\nnode archivo.js",
    whyItHappens: "El navegador ejecuta JavaScript para el frontend. Node.js es un entorno separado que se ejecuta en la terminal/servidor.",
    relatedLessons: ["les-1-1-1"],
  },
  {
    id: "error-blocking-event-loop",
    title: "Bloquear el event loop",
    category: "asincronia",
    description: "Usar operaciones síncronas pesadas (como un bucle infinito o fs.readFileSync con archivos grandes) bloquea el hilo principal y el servidor deja de responder.",
    wrongCode: "const data = fs.readFileSync('archivo-grande.txt', 'utf8');\n// Todo el servidor se detiene hasta que termina la lectura",
    correctCode: "const data = await fsPromises.readFile('archivo-grande.txt', 'utf8');\n// El servidor sigue atendiendo otras peticiones",
    whyItHappens: "Node.js tiene un solo hilo para JavaScript. Si bloqueas ese hilo, ninguna otra petición puede ser atendida hasta que termine la operación.",
    relatedLessons: ["les-1-1-3", "les-2-1-1"],
  },
  {
    id: "error-require-path",
    title: "Ruta incorrecta en require()",
    category: "modulos",
    description: "require() resuelve rutas relativas desde la ubicación del archivo actual, no desde la terminal donde se ejecuta node.",
    wrongCode: "const mod = require('./modulo'); // si modulo.js está en otra carpeta, falla",
    correctCode: "const path = require('path');\nconst mod = require(path.join(__dirname, '../modulos/modulo'));\n// __dirname es el directorio del archivo actual",
    whyItHappens: "require usa rutas relativas al archivo que las contiene, no al directorio de trabajo actual (process.cwd()).",
    relatedLessons: ["les-1-1-2"],
  },
  {
    id: "error-unhandled-promise",
    title: "Promesa sin catch",
    category: "asincronia",
    description: "Si una promesa se rechaza y no tiene un .catch() o try/catch, el proceso de Node.js puede terminar con un error no manejado.",
    wrongCode: "fsPromises.readFile('inexistente.txt', 'utf8')\n  .then(data => console.log(data));\n// Si falla, no hay quien capture el error",
    correctCode: "fsPromises.readFile('inexistente.txt', 'utf8')\n  .then(data => console.log(data))\n  .catch(err => console.error('Error:', err.message));",
    whyItHappens: "Las promesas rechazadas sin manejador provocan un 'unhandledRejection' que puede hacer salir al proceso con código de error.",
    relatedLessons: ["les-2-1-1"],
  },
];
