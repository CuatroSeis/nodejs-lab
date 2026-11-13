import { useState } from "react";
import { CheckCircle, AlertCircle, Play, ArrowLeft } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

interface QuizProps {
  lessonId: string;
  questions: QuizQuestion[];
  onComplete?: (score: { correct: number; total: number; percentage: number }) => void;
  passingPercentage?: number;
}

export default function Quiz({
  lessonId,
  questions,
  onComplete,
  passingPercentage = 80,
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[currentQuestion];
  const userAnswer = answers[current.id];

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < total - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowFeedback(false);
    } else {
      setFinished(true);
      const correctCount = questions.filter((q) => answers[q.id] === q.correctOptionIndex).length;
      const percentage = Math.round((correctCount / total) * 100);
      onComplete?.({ correct: correctCount, total, percentage });
    }
  };

  const isCorrect = userAnswer !== undefined && userAnswer === current.correctOptionIndex;

  if (finished) {
    const correctCount = questions.filter((q) => answers[q.id] === q.correctOptionIndex).length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= passingPercentage;

    return (
      <div className="quiz-result">
        <div className="quiz-result-card">
          {passed ? (
            <div className="result-success">
              <CheckCircle size={48} strokeWidth={2} />
              <h2>¡Aprobado!</h2>
              <p>Has completado la evaluación de esta lección.</p>
            </div>
          ) : (
            <div className="result-failure">
              <AlertCircle size={48} strokeWidth={2} />
              <h2>Sigue practicando</h2>
              <p>No alcanzaste el puntaje mínimo de aprobado ({passingPercentage}%).</p>
            </div>
          )}
          <div className="score-detail">
            <span className="score-value">{correctCount} / {total}</span>
            <span className="score-label">respuestas correctas</span>
          </div>
          <div className="score-detail">
            <span className={`score-percentage ${passed ? "text-success" : "text-danger"}`}>
              {percentage}%
            </span>
            <span className="score-label">de acierto</span>
          </div>
          <div className="quiz-actions">
            <button className="button-primary" onClick={() => window.location.href = `/leccion/${lessonId}`}>
              <ArrowLeft size={16} strokeWidth={2} />
              Volver a la lección
            </button>
            {!passed && (
              <button className="button-outline" onClick={() => {
                setFinished(false);
                setAnswers({});
                setCurrentQuestion(0);
                setShowFeedback(false);
              }}>
                <Play size={16} strokeWidth={2} />
                Intentar de nuevo
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentQuestion + 1) / total) * 100);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <span>Pregunta {currentQuestion + 1} de {total}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <a href={`/leccion/${lessonId}`} className="quiz-back">
          <ArrowLeft size={14} strokeWidth={2} />
          Volver
        </a>
      </div>

      <div className="quiz-card">
        <h2 className="quiz-question">{current.question}</h2>
        <div className="quiz-options">
          {current.options.map((option, index) => {
            const isSelected = userAnswer === index;
            const isRevealed = showFeedback;
            const isCorrectOption = index === current.correctOptionIndex;
            let optionClass = "quiz-option";
            if (isRevealed) {
              if (isCorrectOption) optionClass += " quiz-option-correct";
              else if (isSelected && !isCorrectOption) optionClass += " quiz-option-wrong";
            }
            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswer(index)}
                disabled={isRevealed}
              >
                {isRevealed && (
                  <span className="option-marker">
                    {isCorrectOption ? "✓" : isSelected && !isCorrectOption ? "✗" : ""}
                  </span>
                )}
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="quiz-feedback">
            {isCorrect ? (
              <div className="feedback-correct">
                <CheckCircle size={16} strokeWidth={2} />
                <span>Correcto. {current.explanation}</span>
              </div>
            ) : (
              <div className="feedback-wrong">
                <AlertCircle size={16} strokeWidth={2} />
                <span>Incorrecto. {current.explanation}</span>
              </div>
            )}
          </div>
        )}

        <div className="quiz-actions">
          {currentQuestion < total - 1 ? (
            <button
              className="button-primary"
              onClick={handleNext}
              disabled={userAnswer === undefined || !showFeedback}
            >
              {showFeedback ? "Siguiente pregunta" : "Selecciona una respuesta"}
              <Play size={14} strokeWidth={2} />
            </button>
          ) : (
            <button
              className="button-primary"
              onClick={handleNext}
              disabled={userAnswer === undefined || !showFeedback}
            >
              Ver resultado
              <Play size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
