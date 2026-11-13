import { useParams } from "react-router-dom";
import { MOCK_LESSON } from "../data/mock";
import ExerciseExecution from "../components/ExerciseExecution";
import { ArrowLeft, Code, Play } from "lucide-react";

export default function ExercisePage() {
  const { lessonId } = useParams<{ lessonId: string }>();

  // Ejercicio de ejemplo de la lección mock
  const exercise = {
    id: "ex-les-1-1-1-1",
    starterCode: `// Escribe una función que devuelva el doble de un número\ndoble = (n) => {\n  // tu código aquí\n};\n\nexport default doble;`,
    testCases: [
      { id: "tc-1", input: 2, expected: 4, description: "doble(2) === 4" },
      { id: "tc-2", input: 5, expected: 10, description: "doble(5) === 10" },
      { id: "tc-3", input: 0, expected: 0, description: "doble(0) === 0" },
    ],
  };

  if (!lessonId) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Ejercicio</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="page exercise-page">
      <header className="page-header exercise-header">
        <a href={`/leccion/${lessonId}`} className="breadcrumb">
          <ArrowLeft size={16} strokeWidth={2} />
          Volver a la lección
        </a>
        <h1>Ejercicio de código</h1>
        <p className="page-subtitle">
          Escribe tu solución y ejecuta las pruebas automáticas.
        </p>
      </header>

      <div className="exercise-layout">
        <div className="exercise-statement">
          <h2>Enunciado</h2>
          <div className="statement-content">
            <p>
              Implementa una función llamada <code>doble</code> que reciba un
              número y devuelva su doble.
            </p>
            <ul>
              <li>La función debe aceptar un parámetro numérico.</li>
              <li>Debe retornar el resultado de multiplicar ese número por 2.</li>
              <li>No uses funciones integradas de matemáticas para esta operación simple.</li>
            </ul>
            <div className="example">
              <strong>Ejemplo:</strong>
              <pre className="example-code">doble(3) // 6\ndoble(10) // 20</pre>
            </div>
          </div>
        </div>

        <div className="exercise-editor">
          <ExerciseExecution
            exerciseId={exercise.id}
            starterCode={exercise.starterCode}
            testCases={exercise.testCases}
            lessonId={lessonId}
          />
        </div>
      </div>
    </div>
  );
}
