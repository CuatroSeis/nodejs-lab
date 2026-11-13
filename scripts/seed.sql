-- Seed inicial de Node.js Lab
-- Pobla el nivel 1 completo (Fundamentos de Node.js) y deja esqueletos de niveles 2-7.
-- Ejecutar: mysql -u root -p nodejs_lab < scripts/seed.sql

-- ============================================================
-- NIVELES
-- ============================================================
INSERT INTO levels (id, order_index, title, description, prerequisites) VALUES
('lvl-1', 1, 'Fundamentos de Node.js', 'Introducción al runtime, módulos, eventos y el sistema de archivos', '[]'),
('lvl-2', 2, 'Asincronía y APIs nativas', 'Promesas, async/await, fs, path, eventos', '["lvl-1"]'),
('lvl-3', 3, 'HTTP y servidores', 'Crear servidores con el módulo http y Express', '["lvl-2"]'),
('lvl-4', 4, 'Arquitectura y bases de datos', 'Patrón MVC, MySQL, consultas parametrizadas', '["lvl-3"]'),
('lvl-5', 5, 'Autenticación y seguridad', 'JWT, sesiones, hashing de contraseñas, CORS', '["lvl-4"]'),
('lvl-6', 6, 'Testing y calidad', 'Vitest, Supertest, pruebas de integración', '["lvl-5"]'),
('lvl-7', 7, 'Preparación profesional', 'Streams, rendimiento, despliegue, entrevistas junior', '["lvl-6"]');

-- ============================================================
-- MÓDULOS (solo nivel 1 con contenido; el resto esqueleto)
-- ============================================================
-- Nivel 1: Módulo 1
INSERT INTO modules (id, level_id, order_index, title, description) VALUES
('mod-1-1', 'lvl-1', 1, 'Qué es Node.js y su ecosistema', 'Runtime, V8, event loop, npm'),
('mod-1-2', 'lvl-1', 2, 'Sistema de archivos y paths', 'fs, path, operaciones async');

-- Nivel 2: Módulo 1 (esqueleto)
INSERT INTO modules (id, level_id, order_index, title, description) VALUES
('mod-2-1', 'lvl-2', 1, 'Promesas y async/await', 'Flujo asíncrono sin callbacks');

-- Nivel 3: Módulo 1 (esqueleto)
INSERT INTO modules (id, level_id, order_index, title, description) VALUES
('mod-3-1', 'lvl-3', 1, 'Servidor HTTP nativo', 'Módulo http, crear servidores');

-- ============================================================
-- LECCIONES (nivel 1 completo, módulo 1)
-- ============================================================
-- Lección 1.1.1: Introducción a Node.js
INSERT INTO lessons (id, level_id, module_id, order_index, title, objective, sections, estimated_minutes) VALUES
('les-1-1-1', 'lvl-1', 'mod-1-1', 1, 'Introducción a Node.js', 'Entender qué es Node.js, cómo se diferencia del navegador y cuándo usarlo.',
'{"objective":"Al terminar esta lección sabrás explicar qué es Node.js, su modelo de ejecución basado en eventos y por qué permite usar JavaScript en el servidor.","prerequisites":"Conocer JavaScript básico (variables, funciones, objetos). No se necesita experiencia previa con Node.js.","explanation":"Node.js es un entorno de ejecución para JavaScript fuera del navegador. Está construido sobre el motor V8 de Google (el mismo de Chrome) y añade una capa de APIs para acceder al sistema operativo: archivos, red, procesos, etc.\\n\\nA diferencia del navegador, donde el código se ejecuta en el hilo principal y el DOM está disponible, en Node.js no hay window, document ni DOM. En su lugar, tienes acceso a process, require, __dirname, __filename y módulos globales del sistema.\\n\\nEl corazón de Node.js es el event loop: un bucle que gestiona operaciones asíncronas sin bloquear el hilo principal. Esto permite atender miles de conexiones concurrentes con un solo hilo de JavaScript.","analogy":"Imagina un restaurante con un solo mesero. En un modelo tradicional, cada cliente tendría su propio mesero dedicado (un hilo por petición). Si hay 1000 clientes, necesitas 1000 meseros.\\n\\nNode.js funciona como un mesero único que toma la orden de un cliente, la deja en la cocina y, mientras se prepara, atiende a otro cliente. Cuando la comida está lista, el mesero la entrega. Un solo mesero atiende a muchos clientes porque no espera inactivo mientras se cocina.","example":"// archivo: hola.js\\nconsole.log(\"Hola desde Node.js\");\\n\\n// Ejecutar en terminal:\\n// node hola.js","lineByLine":"console.log(\"Hola desde Node.js\");\\n  └─ Llama a la función console.log, disponible globalmente en Node.js.\\n  └─ Imprime el texto en la terminal (stdout), no en el navegador.","outputPrediction":"Al ejecutar `node hola.js`, se imprime en consola:\\n\\nHola desde Node.js","guidedExercise":"Crea un archivo `saludo.js` que imprima tu nombre y ejecútalo con `node saludo.js`.","independentExercise":"Crea un archivo `datos.js` que declare tres variables (nombre, ciudad, año) y las imprima con console.log usando interpolación de cadenas.","autoTests":"Comprueba que el archivo exista y que contenga al menos una llamada a console.log.","progressiveHints":"Conceptual: Piensa en qué comando imprime texto en la terminal de Node.js.\\nConcreta: Usa console.log seguido del texto entre comillas.\\nCódigo: console.log('Mi nombre');","solution":"console.log('Tu nombre aquí');","commonErrors":"Escribir document.write() o window.alert() — no existen en Node.js.\\nOlvidar ejecutar con `node nombre-archivo.js` en vez de abrir el archivo en el navegador.","summary":"Node.js permite ejecutar JavaScript en el servidor usando el motor V8. No hay DOM ni window. Se ejecuta con `node archivo.js`.","shortEvaluation":"¿Qué motor ejecuta JavaScript en Node.js? Respuesta: V8."}', 25);

-- Lección 1.1.2: Módulos y require()
INSERT INTO lessons (id, level_id, module_id, order_index, title, objective, sections, estimated_minutes) VALUES
('les-1-1-2', 'lvl-1', 'mod-1-1', 2, 'Módulos y require()', 'Entender el sistema de módulos CommonJS de Node.js y cómo importar/exportar código entre archivos.',
'{"objective":"Saber crear módulos con module.exports, importarlos con require() y entender el alcance de cada archivo.","prerequisites":"Lección 1.1.1 completada. Saber escribir JavaScript básico.","explanation":"Node.js usa CommonJS como sistema de módulos por defecto. Cada archivo es un módulo con su propio scope. Las variables y funciones definidas en un archivo no están disponibles en otros a menos que se exporten explícitamente.\\n\\nPara exportar se usa module.exports o exports. Para importar se usa require('./ruta-al-archivo'). Node resuelve las rutas relativas desde la ubicación del archivo actual, no desde donde se ejecuta el comando node.","analogy":"Imagina que cada archivo es una caja cerrada. Solo lo que pones afuera de la caja (module.exports) puede ser visto por otras cajas. Si no pones nada afuera, el contenido permanece privado.","example":"// archivo: util.js\\nfunction suma(a, b) { return a + b; }\\nmodule.exports = { suma };\\n\\n// archivo: index.js\\nconst { suma } = require('./util');\\nconsole.log(suma(2, 3)); // 5","lineByLine":"// util.js\\nfunction suma(a, b) { ... }\\n  └─ Define una función privada al módulo.\\nmodule.exports = { suma };\\n  └─ Exporta la función para que otros archivos la puedan usar.\\n\\n// index.js\\nconst { suma } = require('./util');\\n  └─ Importa el objeto exportado desde util.js.\\nconsole.log(suma(2, 3));\\n  └─ Usa la función importada.","outputPrediction":"Al ejecutar `node index.js` se imprime:\\n\\n5","guidedExercise":"Crea un archivo `mate.js` que exporte una función `duplicar(n)` que devuelva n * 2. Luego crea `index.js` que la importe e imprima el resultado de duplicar(7).","independentExercise":"Crea un módulo `saludos.js` con dos funciones: `saludar(nombre)` y `despedir(nombre)`. Exporta ambas e impórtalas en otro archivo para usarlas.","autoTests":"Comprobar que se puede importar y ejecutar una función exportada desde otro archivo.","progressiveHints":"Conceptual: Cada archivo es un módulo independiente. Para compartir código hay que exportarlo explícitamente.\\nConcreta: Usa module.exports para exportar y require() para importar.\\nCódigo: module.exports = { duplicar }; en un archivo, y const { duplicar } = require('./archivo'); en el otro.","solution":"// saludos.js\\nfunction saludar(nombre) { return 'Hola, ' + nombre; }\\nfunction despedir(nombre) { return 'Adiós, ' + nombre; }\\nmodule.exports = { saludar, despedir };","commonErrors":"Olvidar hacer module.exports y entonces require devuelve {}.\\nUsar rutas absolutas en vez de relativas (./) al importar módulos locales.\\nIntentar usar import/export sin configurar package.json con type: module.","summary":"Cada archivo es un módulo con su propio scope. Se exporta con module.exports y se importa con require(). Las rutas son relativas al archivo actual.","shortEvaluation":"¿Qué se usa para importar un módulo en Node.js (CommonJS)? Respuesta: require()."}, 30);

-- Lección 1.1.3: El event loop
INSERT INTO lessons (id, level_id, module_id, order_index, title, objective, sections, estimated_minutes) VALUES
('les-1-1-3', 'lvl-1', 'mod-1-1', 3, 'El event loop', 'Entender el modelo de ejecución basado en eventos de Node.js y por qué no bloquea el hilo principal.',
'{"objective":"Explicar cómo el event loop permite atender operaciones asíncronas sin bloquear y predecir el orden de ejecución de código sincrónico y asíncrono.","prerequisites":"Lecciones 1.1.1 y 1.1.2 completadas. Entender qué es una función y una función de callback.","explanation":"Node.js usa un solo hilo para ejecutar JavaScript. Las operaciones de E/S (leer archivos, hacer peticiones de red) se delegan al sistema operativo y, cuando terminan, sus callbacks se encolan en el event loop para ser ejecutados cuando el hilo principal esté libre.\\n\\nEsto significa que Node.js puede atender muchas operaciones concurrentes sin crear hilos adicionales, pero también que una operación sincrónica pesada (un bucle infinito o un cálculo grande) bloqueará todo el servidor hasta que termine.","analogy":"Un solo mesero en un restaurante: toma pedidos, los deja en la cocina y atiende a otros clientes mientras se prepara la comida. Cuando un plato está listo, lo entrega. El mesero nunca se queda esperando inactivo frente a la cocina.","example":"console.log('1: inicio');\\nsetTimeout(() => console.log('2: temporizador'), 0);\\nPromise.resolve().then(() => console.log('3: promesa'));\\nconsole.log('4: fin');","lineByLine":"console.log('1: inicio');\\n  └─ Síncrono: se ejecuta inmediatamente.\\nsetTimeout(..., 0);\\n  └─ Asíncrono: se programa para ejecutarse después, aunque el tiempo sea 0.\\nPromise.resolve().then(...);\\n  └─ Asíncrono: se ejecuta tras la cola de microtareas.\\nconsole.log('4: fin');\\n  └─ Síncrono: se ejecuta inmediatamente, antes que los asíncronos.","outputPrediction":"Salida esperada:\\n\\n1: inicio\\n4: fin\\n3: promesa\\n2: temporizador","guidedExercise":"Crea un archivo `orden.js` con los cuatro console.log anteriores y ejecútalo. Verifica que el orden sea el predicho.","independentExercise":"Crea un archivo que use setTimeout con 100 ms y otro con 0 ms, más un console.log síncrono. Predice y verifica el orden de impresión.","autoTests":"Comprobar que el estudiante entiende que el código síncrono se ejecuta antes que los callbacks asíncronos programados con setTimeout(..., 0).","progressiveHints":"Conceptual: El hilo principal termina el código síncrono antes de mirar la cola de tareas asíncronas.\\nConcreta: console.log síncrono va primero; setTimeout y promesas van después.\\nCódigo: Los console.log envueltos en setTimeout siempre se imprimen después de los console.log directos.","solution":"console.log('1: inicio');\\nsetTimeout(() => console.log('2: temporizador'), 0);\\nPromise.resolve().then(() => console.log('3: promesa'));\\nconsole.log('4: fin');","commonErrors":"Creer que setTimeout(..., 0) se ejecuta inmediatamente.\\nPensar que Node.js tiene múltiples hilos para JavaScript por defecto.\\nBloquear el event loop con un bucle infinito o fs.readFileSync en archivos grandes.","summary":"Node.js tiene un solo hilo para JavaScript. Las operaciones asíncronas se delegan y sus callbacks se ejecutan cuando el hilo está libre. El código síncrono siempre se ejecuta primero.","shortEvaluation":"¿Qué se imprime primero: un console.log directo o uno dentro de setTimeout(fn, 0)? Respuesta: el console.log directo."}, 35);

-- Lección 1.2.1: Leer y escribir archivos con fs
INSERT INTO lessons (id, level_id, module_id, order_index, title, objective, sections, estimated_minutes) VALUES
('les-1-2-1', 'lvl-1', 'mod-1-2', 1, 'Leer y escribir archivos con fs', 'Saber leer y escribir archivos usando el módulo fs de Node.js, con versiones síncronas y asíncronas.',
'{"objective":"Usar fs.readFile, fs.writeFile y sus versiones promesas (fs.promises) para operar con archivos de forma no bloqueante.","prerequisites":"Lección 1.1.2 (módulos y require()) completada. Entender rutas de archivos y callbacks/promesas básicas.","explanation":"El módulo fs permite interactuar con el sistema de archivos: leer, escribir, crear, renombrar y eliminar archivos y directorios. Tiene dos estilos de API:\\n\\n1. Síncrona (bloqueante): fs.readFileSync, fs.writeFileSync. El hilo principal se detiene hasta que termina.\\n2. Asíncrona (no bloqueante): fs.readFile, fs.writeFile con callbacks, o fs.promises.readFile con async/await. Recomendada para servidores.\\n\\nLas rutas pueden ser relativas (__dirname) o absolutas.","analogy":"Leer un archivo es como pedir un libro en una biblioteca. La versión síncrona es como quedarte parado en el mostrador esperando a que te entreguen el libro antes de hacer cualquier otra cosa. La versión asíncrona es como dejar tu pedido y seguir leyendo otro libro mientras llega el tuyo.","example":"const fs = require('fs');\\nconst fsPromises = require('fs').promises;\\n\\n// Asíncrono con promesas (recomendado)\\nasync function leer(ruta) {\\n  try {\\n    const data = await fsPromises.readFile(ruta, 'utf8');\\n    console.log(data);\\n  } catch (err) {\\n    console.error('Error:', err.message);\\n  }\\n}\\n\\n// Síncrono (bloqueante)\\nconst data = fs.readFileSync('archivo.txt', 'utf8');","lineByLine":"const fs = require('fs');\\n  └─ Importa el módulo nativo de sistema de archivos.\\nconst fsPromises = require('fs').promises;\\n  └─ Versión basada en promesas de fs.\\nasync function leer(ruta) { ... }\\n  └─ Función asíncrona que puede usar await.\\nawait fsPromises.readFile(ruta, 'utf8');\\n  └─ Espera la lectura sin bloquear el hilo principal.","outputPrediction":"Depende del contenido del archivo leído. Si el archivo contiene 'Hola mundo', se imprime:\\n\\nHola mundo","guidedExercise":"Crea un archivo `datos.txt` con cualquier texto. Luego crea `leer.js` que use fs.promises.readFile para leerlo e imprimir su contenido.","independentExercise":"Crea un archivo `copiar.js` que lea `origen.txt` y escriba su contenido en `destino.txt` usando fs.promises. Maneja errores con try/catch.","autoTests":"Comprobar que el código lee un archivo existente e imprime su contenido, y que maneja el caso de archivo inexistente sin fallar.","progressiveHints":"Conceptual: Usa la versión con promesas (fs.promises) para no bloquear el servidor.\\nConcreta: require('fs').promises te da readFile y writeFile basados en promesas.\\nCódigo: await fsPromises.readFile(ruta, 'utf8') dentro de try/catch.","solution":"const fsPromises = require('fs').promises;\\nasync function copiar(origen, destino) {\\n  const contenido = await fsPromises.readFile(origen, 'utf8');\\n  await fsPromises.writeFile(destino, contenido);\\n}\\n","commonErrors":"Usar fs.readFileSync en un servidor: bloquea todo hasta terminar la lectura.\\nOlvidar el encoding 'utf8' al leer: devuelve un Buffer en vez de texto.\\nNo envolver en try/catch: un error de archivo no encontrado crashea el proceso.","summary":"El módulo fs permite operar con archivos. Usa la versión asíncrona (fs.promises) para no bloquear el hilo principal de Node.js.","shortEvaluation":"¿Qué versión de fs no bloquea el hilo principal? Respuesta: fs.promises (o fs.readFile con callbacks)."}, 40);

-- ============================================================
-- EJERCICIOS (nivel 1)
-- ============================================================
-- Ejercicio de la lección 1.1.1
INSERT INTO exercises (id, lesson_id, title, statement, objectives, difficulty, prerequisites, starter_code, acceptance_criteria) VALUES
('ex-1-1-1-1', 'les-1-1-1', 'Imprime tu nombre', 'Escribe un programa que declare tres variables (nombre, ciudad, año) y las imprima usando interpolación de cadenas con console.log.',
'["Usar console.log para imprimir en la terminal","Usar interpolación de cadenas (template literals)","Declarar variables con const"]',
'beginner',
'[]',
'// Escribe tu solución aquí\\nconst nombre = "";\\nconst ciudad = "";\\nconst año = 0;\\n\\nconsole.log("");',
'["El programa imprime los tres valores usando console.log","Se usan template literals (comillas invertidas) para interpolar","Las variables se declaran con const"]');

-- Casos de prueba del ejercicio 1.1.1 (simulados; el runner actual compara strings)
INSERT INTO exercise_test_cases (id, exercise_id, input_json, expected_json, description) VALUES
('tc-1-1-1-1-1', 'ex-1-1-1-1', 'null', 'null', 'El código se ejecuta sin errores de sintaxis'),
('tc-1-1-1-1-2', 'ex-1-1-1-1', 'null', 'null', 'Contiene al menos una llamada a console.log');

-- Pistas del ejercicio 1.1.1
INSERT INTO exercise_hints (id, exercise_id, hint_level, text) VALUES
('h-1-1-1-1-1', 'ex-1-1-1-1', 1, 'Piensa en qué comando imprime texto en la terminal de Node.js.'),
('h-1-1-1-1-2', 'ex-1-1-1-1', 2, 'Usa console.log seguido del texto entre comillas invertidas para interpolar variables.'),
('h-1-1-1-1-3', 'ex-1-1-1-1', 3, 'console.log(`Hola, me llamo ${nombre} y vivo en ${ciudad}`);');

-- Ejercicio de la lección 1.1.2 (módulos)
INSERT INTO exercises (id, lesson_id, title, statement, objectives, difficulty, prerequisites, starter_code, acceptance_criteria) VALUES
('ex-1-1-2-1', 'les-1-1-2', 'Módulo de saludos', 'Crea un módulo `saludos.js` con dos funciones: `saludar(nombre)` y `despedir(nombre)`. Exporta ambas con module.exports e impórtalas en otro archivo para usarlas.',
'["Exportar funciones con module.exports","Importar módulos con require()","Usar funciones importadas"]',
'beginner',
'["Lección 1.1.2"]',
// starterCode será un string JSON con dos archivos simulados; el runner actual solo ejecuta un archivo
'// saludos.js\\nfunction saludar(nombre) {\\n  return "Hola, " + nombre;\\n}\\nfunction despedir(nombre) {\\n  return "Adiós, " + nombre;\\n}\\nmodule.exports = { saludar, despedir };\\n\\n// index.js (simulado)\\nconst { saludar, despedir } = require("./saludos");\\nconsole.log(saludar("Ana"));\\nconsole.log(despedir("Ana"));',
'["El módulo exporta saludar y despedir","Se importa el módulo con require()","Se imprimen los resultados de ambas funciones"]');

INSERT INTO exercise_test_cases (id, exercise_id, input_json, expected_json, description) VALUES
('tc-1-1-2-1-1', 'ex-1-1-2-1', 'null', 'null', 'El módulo se exporta e importa correctamente');

INSERT INTO exercise_hints (id, exercise_id, hint_level, text) VALUES
('h-1-1-2-1-1', 'ex-1-1-2-1', 1, 'Cada archivo es un módulo independiente. Para compartir código hay que exportarlo explícitamente.'),
('h-1-1-2-1-2', 'ex-1-1-2-1', 2, 'Usa module.exports = { saludar, despedir }; para exportar y const { saludar, despedir } = require('./saludos'); para importar.'),
('h-1-1-2-1-3', 'ex-1-1-2-1', 3, 'Recuerda que la ruta en require() es relativa al archivo actual (./saludos).');

-- Ejercicio de la lección 1.1.3 (event loop)
INSERT INTO exercises (id, lesson_id, title, statement, objectives, difficulty, prerequisites, starter_code, acceptance_criteria) VALUES
('ex-1-1-3-1', 'les-1-1-3', 'Predice el orden', 'Escribe un programa que imprima cuatro mensajes en este orden exacto: "inicio", "fin", "promesa", "temporizador". Usa console.log directo, setTimeout y Promise.',
'["Entender el event loop de Node.js","Saber que el código síncrono se ejecuta antes que los asíncronos","Predecir el orden de salida de programas"]',
'beginner',
'["Lección 1.1.3"]',
'console.log("inicio");\\n\\n// Tu código aquí\\nsetTimeout(() => {}, 0);\\nPromise.resolve().then(() => {});\\nconsole.log("fin");',
'["Se imprime "inicio" primero","Se imprime "fin" segundo","Se imprime "promesa" tercero","Se imprime "temporizador" último"]');

INSERT INTO exercise_test_cases (id, exercise_id, input_json, expected_json, description) VALUES
('tc-1-1-3-1-1', 'ex-1-1-3-1', 'null', 'null', 'El orden de salida es correcto');

INSERT INTO exercise_hints (id, exercise_id, hint_level, text) VALUES
('h-1-1-3-1-1', 'ex-1-1-3-1', 1, 'El código síncrono (console.log directo) siempre se ejecuta antes que las tareas asíncronas.'),
('h-1-1-3-1-2', 'ex-1-1-3-1', 2, 'Promise.resolve().then() va en la cola de microtareas y setTimeout en la cola de macrotareas; las microtareas tienen prioridad.'),
('h-1-1-3-1-3', 'ex-1-1-3-1', 3, 'Orden: console.log("inicio"); console.log("fin"); Promise...then(() => console.log("promesa")); setTimeout(() => console.log("temporizador"), 0);');

-- Ejercicio de la lección 1.2.1 (fs)
INSERT INTO exercises (id, lesson_id, title, statement, objectives, difficulty, prerequisites, starter_code, acceptance_criteria) VALUES
('ex-1-2-1-1', 'les-1-2-1', 'Leer un archivo', 'Crea un programa que lea el archivo `datos.txt` usando fs.promises.readFile e imprima su contenido. Maneja errores con try/catch.',
'["Leer un archivo de forma asíncrona con fs.promises","Manejar errores con try/catch","Especificar encoding utf8"]',
'beginner',
'["Lección 1.2.1"]',
'const fsPromises = require("fs").promises;\\n\\nasync function leerArchivo(ruta) {\\n  // Tu código aquí\\n}\\n\\nleerArchivo("datos.txt");',
'["Usa fs.promises.readFile para leer el archivo","Espera el resultado con await","Envuelve en try/catch para manejar errores","Especifica "utf8" como segundo argumento"]');

INSERT INTO exercise_test_cases (id, exercise_id, input_json, expected_json, description) VALUES
('tc-1-2-1-1-1', 'ex-1-2-1-1', 'null', 'null', 'El código lee un archivo sin bloquear el hilo principal');

INSERT INTO exercise_hints (id, exercise_id, hint_level, text) VALUES
('h-1-2-1-1-1', 'ex-1-2-1-1', 1, 'Usa la versión con promesas de fs para no bloquear el servidor.'),
('h-1-2-1-1-2', 'ex-1-2-1-1', 2, 'const fsPromises = require("fs").promises; te da readFile basado en promesas.'),
('h-1-2-1-1-3', 'ex-1-2-1-1', 3, 'await fsPromises.readFile(ruta, "utf8") dentro de una función async con try/catch.');

-- ============================================================
-- COMENTARIO: niveles 2-7 quedan como esqueletos (sin lecciones ni ejercicios)
-- ============================================================
-- Se poblarán en fases posteriores a medida que se apruebe cada nivel.
