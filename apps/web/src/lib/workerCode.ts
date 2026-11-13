// Código del Web Worker aislado (sandbox para ejecución de ejercicios y proyectos).
// Se ejecuta en un hilo separado, sin acceso a Node (fs, net, child_process),
// red, credenciales ni entorno del sistema. Solo lógica JS pura.
export const WORKER_CODE = `
const DEFAULT_TIME_LIMIT_MS = 5000;
const DEFAULT_MAX_OUTPUT_CHARS = 5000;

const SAFE_GLOBALS = {
  Object, Array, String, Number, Boolean, Math, Date, JSON, RegExp,
  Error, TypeError, ReferenceError, SyntaxError, parseInt, parseFloat,
  isNaN, isFinite, encodeURI, decodeURI,
  console: { log: (..._args) => {} },
};

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max) + "\\n...[salida truncada a " + max + " caracteres]";
}

function runInSandbox(code, input, timeLimitMs) {
  return new Promise((resolve) => {
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      resolve({ output: "", error: "Tiempo de ejecución excedido (" + timeLimitMs + " ms)" });
    }, timeLimitMs);

    try {
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

self.addEventListener("message", async (event) => {
  const input = event.data;

  if (!input || typeof input.code !== "string") {
    self.postMessage({ error: "Entrada inválida para el runner" });
    return;
  }

  const results = await Promise.all(
    input.testCases.map(async (tc) => {
      const start = Date.now();
      let passed = false;
      let output;
      let error;
      let timedOut = false;

      try {
        const { output: rawOutput, error: rawError } = await runInSandbox(
          input.code,
          tc.input,
          input.timeLimitMs ?? DEFAULT_TIME_LIMIT_MS
        );
        output = rawOutput;
        error = rawError;
        timedOut = error === "Tiempo de ejecución excedido" || error === "Tiempo de ejecución excedido (" + input.timeLimitMs + " ms)";
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
`;
