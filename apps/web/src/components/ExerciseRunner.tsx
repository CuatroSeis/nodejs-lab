import { useCallback, useRef, useEffect, useState } from "react";
import { Play, Terminal, CheckCircle, AlertCircle, Clock, CheckSquare } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { WORKER_CODE } from "../lib/workerCode";
import { useProgress } from "../hooks/useProgress";

interface ExerciseRunnerProps {
  code: string;
  onCodeChange: (code: string) => void;
  testCases: Array<{
    id: string;
    input: unknown;
    expected: unknown;
    description: string;
  }>;
  onComplete?: (results: { passed: number; total: number }) => void;
  lessonId?: string;
  editorHeight?: string;
  showSolution?: boolean;
  solutionCode?: string;
  acceptanceCriteria?: string[];
  solutionVisible?: boolean;
  onToggleSolution?: () => void;
}

interface TestResultItem {
  testCaseId: string;
  passed: boolean;
  output: string | undefined;
  error: string | undefined;
  executionTimeMs: number;
  timedOut: boolean;
}

export default function ExerciseRunner({
  code,
  onCodeChange,
  testCases,
  onComplete,
  lessonId = "",
  editorHeight = "320px",
  showSolution = false,
  solutionCode = "",
  acceptanceCriteria,
  solutionVisible = false,
  onToggleSolution,
}: ExerciseRunnerProps) {
  const [results, setResults] = useState<TestResultItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const { setStatus, incrementAttempts, setError } = useProgress();

  // Crear el Web Worker aislado una sola vez
  useEffect(() => {
    let worker: Worker | null = null;
    let objectUrl: string | null = null;
    try {
      const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
      objectUrl = URL.createObjectURL(blob);
      worker = new Worker(objectUrl);
      workerRef.current = worker;
    } catch (err) {
      console.error("Error creando Web Worker:", err);
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  // Limpiar el worker al desmontar el componente
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const handleChange = (newCode: string) => {
    onCodeChange(newCode);
  };

  const runExercise = useCallback(async () => {
    if (!code.trim() || !workerRef.current) return;

    setIsRunning(true);
    setResults([]);

    const input = {
      code,
      testCases: testCases.map((tc) => ({
        id: tc.id,
        input: tc.input,
        expected: tc.expected,
      })),
      timeLimitMs: 5000,
      maxOutputChars: 5000,
    };

    const cancelled = false;

    try {
      const exerciseResults = await new Promise<TestResultItem[]>(
        (resolve, reject) => {
          const worker = workerRef.current!;

          const onMessage = (event: MessageEvent) => {
            if (cancelled) return;
            if (Array.isArray(event.data)) {
              resolve(event.data);
            } else {
              reject(new Error(event.data?.error || "Error desconocido del runner"));
            }
            worker.removeEventListener("message", onMessage);
          };

          const onError = (err: ErrorEvent) => {
            if (cancelled) return;
            reject(new Error(err.message || "Error del Web Worker"));
            worker.removeEventListener("error", onError);
          };

          worker.addEventListener("message", onMessage);
          worker.addEventListener("error", onError);
          worker.postMessage(input);
        }
      );

      if (cancelled) return;

      setResults(exerciseResults);

      const passedCount = exerciseResults.filter((r) => r.passed).length;
      const totalCount = exerciseResults.length;

      if (lessonId) {
        incrementAttempts(lessonId);
        if (passedCount === totalCount && totalCount > 0) {
          setStatus(lessonId, "approved");
        } else {
          setStatus(lessonId, "attempted");
          const firstError = exerciseResults.find((r) => r.error);
          if (firstError?.error) {
            setError(lessonId, firstError.error);
          }
        }
      }

      onComplete?.({ passed: passedCount, total: totalCount });
      setShowOutput(true);
    } catch (err: unknown) {
      console.error("Error ejecutando ejercicio:", err);
      if (setError) {
        setError(lessonId, String(err instanceof Error ? err.message : err) as string);
      }
    } finally {
      if (!cancelled) {
        setIsRunning(false);
      }
    }
  }, [code, testCases, lessonId, incrementAttempts, setStatus, setError, onComplete]);

  // Cancelar ejecución previa cuando se llame de nuevo
  const cancelExecution = useCallback(() => {
    // La cancelación se maneja mediante el flag 'cancelled' dentro de runExercise
  }, []);

  const allPassed = results.length > 0 && results.every((r) => r.passed);

  return (
    <div className="exercise-runner">
      <div className="exercise-header">
        <div className="exercise-actions">
          <span className="sandbox-badge">Web Worker aislado</span>
          <button
            className="run-button"
            onClick={runExercise}
            disabled={isRunning || !workerRef.current}
          >
            {isRunning ? (
              <span>
                <Clock size={16} strokeWidth={2} />
                Ejecutando...
              </span>
            ) : (
              <span>
                <Play size={16} strokeWidth={2} />
                Ejecutar código
              </span>
            )}
          </button>
          <button
            className="toggle-output"
            onClick={() => setShowOutput(!showOutput)}
          >
            <Terminal size={16} strokeWidth={2} />
            {showOutput ? "Ocultar salida" : "Mostrar salida"}
          </button>
          {showSolution && onToggleSolution && (
            <button
              className="toggle-solution"
              onClick={onToggleSolution}
            >
              <CheckSquare size={16} strokeWidth={2} />
              {solutionVisible ? "Ocultar solución" : "Ver solución"}
            </button>
          )}
        </div>
      </div>

      <div className="editor-panel">
        <CodeEditor
          value={code}
          onChange={handleChange}
          height={editorHeight}
        />
      </div>

      {showOutput && results.length > 0 && (
        <div className="results-panel">
          <div className="results-summary">
            <span className={allPassed ? "status-success" : "status-warning"}>
              {allPassed ? <CheckCircle size={14} strokeWidth={2} /> : <AlertCircle size={14} strokeWidth={2} />}
              {results.filter((r) => r.passed).length} / {results.length} pruebas aprobadas
            </span>
          </div>
          <div className="test-results">
            {results.map((result) => (
              <div
                key={result.testCaseId}
                className={`test-result-item ${result.passed ? "test-passed" : "test-failed"}`}
              >
                <div className="test-result-header">
                  <span className={result.passed ? "test-passed-icon" : "test-failed-icon"}>
                    {result.passed ? "✓" : "✗"}
                  </span>
                  <span className="test-case-description">{result.testCaseId}</span>
                  <span className="test-time">{result.executionTimeMs} ms</span>
                </div>
                {result.timedOut && (
                  <div className="test-error">Tiempo de ejecución excedido</div>
                )}
                {result.error && !result.timedOut && (
                  <div className="test-error">{result.error}</div>
                )}
                {result.output !== undefined && !result.passed && (
                  <div className="test-output">
                    <span className="output-label">Salida:</span>
                    <pre className="output-text">{result.output}</pre>
                  </div>
                )}
                {result.output !== undefined && result.passed && (
                  <div className="test-output">
                    <span className="output-label">Salida esperada:</span>
                    <pre className="output-text">{result.output}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showSolution && solutionCode && acceptanceCriteria && (
        <div className="solution-panel">
          <h4>Solución explicada</h4>
          <pre className="solution-code">{solutionCode}</pre>
          <div className="acceptance-criteria">
            <h5>Criterios de aprobación:</h5>
            <ul>
              {acceptanceCriteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
