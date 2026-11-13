import { CommonError } from "../data/concepts";

interface ErrorCardProps {
  error: CommonError;
}

export default function ErrorCard({ error }: ErrorCardProps) {
  return (
    <article className="error-card">
      <div className="error-card-header">
        <span className="error-category">{error.category}</span>
        <h3 className="error-card-title">{error.title}</h3>
      </div>
      <p className="error-card-description">{error.description}</p>
      <div className="error-card-comparison">
        <div className="error-comparison-column">
          <span className="comparison-label">❌ Código incorrecto</span>
          <pre className="comparison-code">{error.wrongCode}</pre>
        </div>
        <div className="error-comparison-column">
          <span className="comparison-label">✅ Código correcto</span>
          <pre className="comparison-code">{error.correctCode}</pre>
        </div>
      </div>
      <div className="error-card-explanation">
        <span className="explanation-label">¿Por qué ocurre?</span>
        <p>{error.whyItHappens}</p>
      </div>
      <div className="error-card-lessons">
        <span className="error-lesson-label">Relacionado con:</span>
        {error.relatedLessons.map((id) => (
          <span key={id} className="error-lesson-tag">{id}</span>
        ))}
      </div>
    </article>
  );
}
