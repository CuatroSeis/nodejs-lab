import { INTEGRATOR_PROJECTS } from "../data/integratorProjects";
import IntegratorProject from "../components/IntegratorProject";

export default function IntegratorProjects() {
  // Agrupar proyectos por nivel
  const niveles = ["level-1", "level-2", "level-3"] as const;
  const proyectosPorNivel = niveles.map((nivel) => ({
    nivel,
    proyectos: INTEGRATOR_PROJECTS.filter((p) => p.level === nivel),
  }));

  return (
    <div className="page integrator-page">
      <header className="page-header">
        <h1>Proyectos integradores</h1>
        <p className="page-subtitle">
          Aplica lo aprendido en cada nivel con un proyecto práctico que integra
          los conceptos clave. Ejecuta el código y verifica que pasen las pruebas.
        </p>
      </header>

      <div className="integrator-list">
        {proyectosPorNivel.map((grupo) => (
          <section key={grupo.nivel} className="nivel-section">
            <h2 className="nivel-title">{grupo.proyectos[0]?.levelTitle}</h2>
            <div className="proyectos-grid">
              {grupo.proyectos.map((proyecto) => (
                <article key={proyecto.id} className="proyecto-card">
                  <div className="proyecto-card-header">
                    <h3 className="proyecto-title">{proyecto.title}</h3>
                    <span className="proyecto-minutos">{proyecto.estimatedMinutes} min</span>
                  </div>
                  <p className="proyecto-description">{proyecto.description.split("\n")[0]}</p>
                  <IntegratorProject project={proyecto} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
