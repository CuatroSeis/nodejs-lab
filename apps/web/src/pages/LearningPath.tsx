import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { School, Play } from "lucide-react";
import { fetchLevels, fetchModules, type Level, type Module } from "../lib/api";
import ModuleCard from "../components/ModuleCard";

export default function LearningPath() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [modulesByLevel, setModulesByLevel] = useState<Record<string, Module[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchLevels()
      .then((fetchedLevels) => {
        if (cancelled) return;
        setLevels(fetchedLevels);
        // Cargar módulos de cada nivel
        Promise.all(
          fetchedLevels.map((lvl) =>
            fetchModules(lvl.id).then((mods) => ({ levelId: lvl.id, modules: mods }))
          )
        ).then((results) => {
          if (cancelled) return;
          const map: Record<string, Module[]> = {};
          results.forEach(({ levelId, modules }) => {
            map[levelId] = modules;
          });
          setModulesByLevel(map);
          setLoading(false);
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Ruta de aprendizaje</h1>
        </header>
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <School size={32} strokeWidth={2} style={{ color: "var(--text-muted)" }} />
          <p>Cargando ruta de aprendizaje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Ruta de aprendizaje</h1>
        <p className="page-subtitle">
          Avanza por los niveles de forma progresiva. Cada nivel desbloquea el siguiente.
        </p>
      </header>

      <div className="learning-path">
        {levels.map((level) => {
          const modules = modulesByLevel[level.id] || [];
          return (
            <section key={level.id} className="level-section">
              <div className="level-section-header">
                <h2 className="level-section-title">
                  Nivel {level.order}: {level.title}
                </h2>
                <p className="level-section-description">{level.description}</p>
                <span className="level-section-hours">
                  {level.prerequisites.length > 0 ? "Requiere nivel previo" : "Disponible"}
                </span>
              </div>
              <div className="level-section-modules">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={{
                      id: module.id,
                      title: module.title,
                      description: module.description,
                      order: module.order,
                      lessons: [],
                    }}
                  />
                ))}
                {modules.length === 0 && (
                  <div className="empty-modules">Próximamente: módulos de este nivel.</div>
                )}
              </div>
              {level.prerequisites.length > 0 && (
                <div className="level-locked-banner">
                  🔒 Nivel bloqueado. Completa el nivel anterior para continuar.
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
