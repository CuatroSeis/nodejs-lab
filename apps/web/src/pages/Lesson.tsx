import { useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_LESSON } from "../data/mock";
import { useProgress } from "../hooks/useProgress";
import { BookOpen, Code, AlertCircle, CheckCircle, Play } from "lucide-react";
const SECTION_LABELS: Record<string, string> = {
  objective: "Objetivo",
  prerequisites: "Conocimientos previos",
  explanation: "Explicación",
  analogy: "Analogía",
  example: "Ejemplo comentado",
  lineByLine: "Análisis línea por línea",
  outputPrediction: "Predicción de salida",
  guidedExercise: "Ejercicio guiado",
  independentExercise: "Ejercicio independiente",
  autoTests: "Pruebas automáticas",
  progressiveHints: "Pistas progresivas",
  solution: "Solución explicada",
  commonErrors: "Errores frecuentes",
  summary: "Resumen",
  shortEvaluation: "Evaluación corta",
};

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { setStatus, incrementAttempts, setError } = useProgress();
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  if (!MOCK_LESSON || MOCK_LESSON.id !== lessonId) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Lección no encontrada</h1>
        </header>
      </div>
    );
  }

  const handleMarkRead = () => {
    setStatus(lessonId, "read");
  };

  const handleAttempt = () => {
    incrementAttempts(lessonId);
    setStatus(lessonId, "attempted");
  };

  const sections = Object.entries(MOCK_LESSON.sections).map(
    ([key, content]) => ({ key, label: SECTION_LABELS[key] || key, content })
  );

  return (
    <div className="page lesson-page">
      <header className="page-header lesson-header">
        <div className="lesson-header-meta">
          <span className="lesson-order">Lección {MOCK_LESSON.order}</span>
          <span className="lesson-duration">{MOCK_LESSON.estimatedMinutes} min</span>
        </div>
        <h1>{MOCK_LESSON.title}</h1>
        <p className="page-subtitle">{MOCK_LESSON.objective}</p>
        <div className="lesson-actions">
          <button className="button-outline" onClick={handleMarkRead}>
            <BookOpen size={16} strokeWidth={2} />
            Marcar como leída
          </button>
          <button className="button-primary" onClick={handleAttempt}>
            <Play size={16} strokeWidth={2} />
            Marcar como intentada
          </button>
        </div>
      </header>

      <div className="lesson-content">
        <aside className="lesson-toc">
          <h3 className="toc-title">Contenido</h3>
          <nav className="toc-list">
            {sections.map((section) => (
              <button
                key={section.key}
                className="toc-item"
                onClick={() => {
                  const el = document.getElementById(`section-${section.key}`);
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="lesson-body">
          {sections.map((section) => (
            <section key={section.key} id={`section-${section.key}`} className="lesson-section">
              <div className="lesson-section-header">
                <span className="section-badge">{section.label}</span>
              </div>
              <div className="lesson-section-content">
                {String(section.content).split("\n\n").map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ))}

          {/* Ejercicio y solución */}
          <section className="lesson-section lesson-exercise">
            <div className="lesson-section-header">
              <span className="section-badge">Ejercicio independiente</span>
            </div>
            <div className="lesson-section-content">
              <p>{MOCK_LESSON.sections.independentExercise}</p>
              <div className="exercise-controls">
                <button className="button-outline" onClick={() => setShowHints(!showHints)}>
                  {showHints ? "Ocultar pistas" : "Ver pistas progresivas"}
                </button>
                <button
                  className="button-outline"
                  onClick={() => setShowSolution(!showSolution)}
                  disabled={!showHints}
                >
                  {showSolution ? "Ocultar solución" : "Ver solución (tras pistas)"}
                </button>
              </div>

              {showHints && (
                <div className="hints-panel">
                  <h4>Pistas progresivas</h4>
                  {String(MOCK_LESSON.sections.progressiveHints).split("\n").map((hint: string, i: number) => (
                    <div key={i} className="hint-item">
                      <span className="hint-level">Pista {i + 1}</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              )}

              {showSolution && (
                <div className="solution-panel">
                  <h4>Solución explicada</h4>
                  <pre className="solution-code">{MOCK_LESSON.sections.solution}</pre>
                  <button className="button-primary small" onClick={handleAttempt}>
                    <CheckCircle size={14} strokeWidth={2} />
                    Marcar ejercicio como intentado
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="lesson-section lesson-evaluation">
            <div className="lesson-section-header">
              <span className="section-badge">Evaluación corta</span>
            </div>
            <div className="lesson-section-content">
              <p>{MOCK_LESSON.sections.shortEvaluation}</p>
              <div className="evaluation-actions">
                <a href={`/leccion/${lessonId}/evaluacion`} className="button-primary">
                  <CheckCircle size={14} strokeWidth={2} />
                  Ir a la evaluación
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
