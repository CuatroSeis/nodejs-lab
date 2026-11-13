import { useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_LESSON } from "../data/mock";
import Quiz from "../components/Quiz";
import { useProgress } from "../hooks/useProgress";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";

const EVALUATION_QUESTIONS: Array<{
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}> = [
  {
    id: "q1",
    question: "¿Qué motor ejecuta JavaScript en Node.js?",
    options: ["SpiderMonkey", "V8", "JavaScriptCore", "Chakra"],
    correctOptionIndex: 1,
    explanation: "Node.js está construido sobre el motor V8 de Google, el mismo de Chrome.",
  },
  {
    id: "q2",
    question: "¿Qué comando se usa para ejecutar un archivo de Node.js?",
    options: ["run archivo.js", "node archivo.js", "start archivo.js", "exec archivo.js"],
    correctOptionIndex: 1,
    explanation: "Se ejecuta con `node nombre-archivo.js` desde la terminal.",
  },
  {
    id: "q3",
    question: "¿Qué NO está disponible en Node.js (a diferencia del navegador)?",
    options: ["console.log", "setTimeout", "window", "require"],
    correctOptionIndex: 2,
    explanation: "Node.js no tiene DOM ni objeto `window`. Tiene `require`, `process`, `__dirname`, etc.",
  },
];

export default function EvaluationPage() {
  const { lessonId: lessonIdParam } = useParams<{ lessonId: string }>();
  const lessonId = lessonIdParam ?? "";
  const { setStatus } = useProgress();
  const [evaluated, setEvaluated] = useState(false);

  const handleComplete = (score: { correct: number; total: number; percentage: number }) => {
    if (score.percentage >= 80) {
      setStatus(lessonId, "approved");
    } else {
      setStatus(lessonId, "attempted");
    }
    setEvaluated(true);
  };

  if (!lessonId) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Evaluación no encontrada</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="page evaluation-page">
      <header className="page-header">
        <a href={`/leccion/${lessonId}`} className="breadcrumb">
          <ArrowLeft size={16} strokeWidth={2} />
          Volver a la lección
        </a>
        <h1>Evaluación corta</h1>
        <p className="page-subtitle">
          Responde las preguntas para validar lo aprendido en esta lección.
        </p>
      </header>

      <div className="evaluation-wrapper">
        {evaluated ? (
          <div className="evaluation-complete">
            <div className="complete-card">
              <CheckCircle size={48} strokeWidth={2} />
              <h2>Evaluación completada</h2>
              <p>Tu progreso se ha actualizado. Puedes continuar con la siguiente lección.</p>
              <div className="complete-actions">
                <a href={`/leccion/${lessonId}`} className="button-outline">
                  Volver a la lección
                </a>
                <a href="/ruta" className="button-primary">
                  Continuar en la ruta
                </a>
              </div>
            </div>
          </div>
        ) : (
          <Quiz
            lessonId={lessonId}
            questions={EVALUATION_QUESTIONS}
            onComplete={handleComplete}
            passingPercentage={80}
          />
        )}
      </div>
    </div>
  );
}
