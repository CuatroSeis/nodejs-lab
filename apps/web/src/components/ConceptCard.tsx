import { Concept } from "../data/concepts";

interface ConceptCardProps {
  concept: Concept;
}

export default function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <article className="concept-card">
      <div className="concept-card-header">
        <span className="concept-category">{concept.category}</span>
        <h3 className="concept-card-title">{concept.title}</h3>
      </div>
      <p className="concept-card-description">{concept.description}</p>
      <div className="concept-card-code">
        <pre className="concept-code-block">{concept.codeExample}</pre>
      </div>
      <div className="concept-card-lessons">
        <span className="concept-lesson-label">Relacionado con:</span>
        {concept.relatedLessons.map((id) => (
          <span key={id} className="concept-lesson-tag">{id}</span>
        ))}
      </div>
    </article>
  );
}
