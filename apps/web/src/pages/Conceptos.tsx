import { CONCEPTS, COMMON_ERRORS } from "../data/concepts";
import ConceptCard from "../components/ConceptCard";
import ErrorCard from "../components/ErrorCard";

export default function Conceptos() {
  // Agrupar conceptos por categoría
  const categories = ["fundamentos", "asincronia", "http", "modulos", "sistema-archivos"];
  const categoryLabels: Record<string, string> = {
    fundamentos: "Fundamentos",
    asincronia: "Asincronía",
    http: "HTTP y Servidores",
    modulos: "Módulos",
    "sistema-archivos": "Sistema de Archivos",
  };

  const conceptsByCategory = categories.map((cat) => ({
    category: cat,
    label: categoryLabels[cat] || cat,
    concepts: CONCEPTS.filter((c) => c.category === cat),
  }));

  const errorsByCategory = categories.map((cat) => ({
    category: cat,
    label: categoryLabels[cat] || cat,
    errors: COMMON_ERRORS.filter((e) => e.category === cat),
  }));

  return (
    <div className="page conceptos-page">
      <header className="page-header">
        <h1>Biblioteca de conceptos</h1>
        <p className="page-subtitle">
          Conceptos clave y errores frecuentes de Node.js, organizados por categoría.
        </p>
      </header>

      <section className="card conceptos-section">
        <h2 className="section-title">Conceptos clave</h2>
        <div className="concepts-grid">
          {conceptsByCategory.map((group) => (
            <div key={group.category} className="concept-category-group">
              <h3 className="category-title">{group.label}</h3>
              <div className="concept-cards">
                {group.concepts.length > 0 ? (
                  group.concepts.map((concept) => (
                    <ConceptCard key={concept.id} concept={concept} />
                  ))
                ) : (
                  <p className="empty-state">Próximamente: más conceptos en esta categoría.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card errores-section">
        <h2 className="section-title">Errores frecuentes</h2>
        <p className="section-subtitle">
          Los errores más comunes al aprender Node.js y cómo corregirlos.
        </p>
        <div className="errors-grid">
          {errorsByCategory.map((group) => (
            <div key={group.category} className="error-category-group">
              <h3 className="category-title">{group.label}</h3>
              <div className="error-cards">
                {group.errors.length > 0 ? (
                  group.errors.map((error) => (
                    <ErrorCard key={error.id} error={error} />
                  ))
                ) : (
                  <p className="empty-state">Próximamente: más errores documentados en esta categoría.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
