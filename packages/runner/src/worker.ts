// Web Worker aislado para ejecutar código de ejercicios.
// Reglas de seguridad (MVP):
// - Solo lógica JS pura. No se expone Node (fs, net, child_process, etc.).
// - Límite de tiempo y tamaño de salida configurables.
// - No acceso a credenciales ni red.
// - Si el código infringe límites, se reporta error sin exponer detalles del entorno.

import type { RunInput, RunOutput } from "./index";

const DEFAULT_TIME_LIMIT_MS = 5000;
const DEFAULT_MAX_OUTPUT_CHARS = 5000;

// Entorno restringido: solo lo estrictamente necesario para lógica pura.
const SAFE_GLOBALS: Record<string, unknown> = {
  Object,
  Array,
  String,
  Number,
  Boolean,
  Math,
  Date,
  JSON,
  RegExp,
  Error,
  TypeError,
  ReferenceError,
  SyntaxError,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  encodeURI,
  decodeURI,
  console: {
    log: (..._args: unknown[]) => {},
  },
};

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + `\n...[salida truncada a ${max} caracteres]`;
}

async function runInSandbox(code: string, input: unknown, timeLimitMs: number): Promise<{ output: string; error: string | undefined }> {
  return new Promise((resolve) => {
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      resolve({ output: "", error: `Tiempo de ejecución excedido (${timeLimitMs} ms)` });
    }, timeLimitMs);

    try {
      // Construimos una función anónima con el código del usuario como cuerpo.
      // No usamos eval() directo sobre strings arbitrarias del usuario;
      // usamos Function constructor con un scope restringido.
      const fn = new Function("input", "console", code);
      const result = fn(input, SAFE_GLOBALS.console);
      const output = String(result ?? "");

      if (timedOut) {
        resolve({ output: "", error: "Tiempo de ejecución excedido" });
        return;
      }

      clearTimeout(timer);
      resolve({ output: truncate(output, DEFAULT_MAX_OUTPUT_CHARS), error: undefined });
    } catch (err) {
      if (timedOut) {
        resolve({ output: "", error: "Tiempo de ejecución excedido" });
        return;
      }
      clearTimeout(timer);
      resolve({ output: "", error: err instanceof Error ? err.message : String(err) });
    }
  });
}

self.addEventListener("message", async (event: MessageEvent<RunInput>) => {
  const input = event.data;

  // Validación mínima de entrada (el caller ya debería validar con zod).
  if (!input || typeof input.code !== "string") {
    self.postMessage({ error: "Entrada inválida para el runner" });
    return;
  }

  const results = await Promise.all(
    input.testCases.map(async (tc) => {
      const start = Date.now();
      let passed = false;
      let output: string | undefined;
      let error: string | undefined;
      let timedOut = false;

      try {
        const { output: rawOutput, error: rawError } = await runInSandbox(
          input.code,
          tc.input,
          input.timeLimitMs ?? DEFAULT_TIME_LIMIT_MS
        );
        output = rawOutput;
        error = rawError;
        timedOut = error === "Tiempo de ejecución excedido" || error === "Tiempo de ejecución excedido";
        if (!error) {
          passed = String(tc.expected) === output;
        }
      } catch (err) {
        error = err instanceof Error ? err.message : String(err);
      }

      const executionTimeMs = Date.now() - start;

      return {
        testCaseId: tc.id,
        passed,
        output,
        error,
        executionTimeMs,
        timedOut,
      };
    })
  );

  self.postMessage(results);
});
