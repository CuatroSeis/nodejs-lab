import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Play, Clock } from "lucide-react";
import { fetchLevels, type Level } from "../lib/api";
import { useProgress } from "../hooks/useProgress";

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats } = useProgress();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevels()
      .then(setLevels)
      .finally(() => setLoading(false));
  }, []);

  const { total, approved, attempted, read, unstarted } = stats();

  if (loading) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Dashboard</h1>
        </header>
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Clock size={32} strokeWidth={2} style={{ color: "var(--text-muted)" }} />
          <p>Cargando niveles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">
          Tu laboratorio de Node.js. Rastrea tu progreso y comienza el siguiente nivel.
        </p>
      </header>

      <section className="card stats-card">
        <h2 className="card-title">Resumen de progreso</h2>
        <div className="stats-row">
          <div className="stat">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Lecciones</div>
          </div>
          <div className="stat stat-approved">
            <div className="stat-value">{approved}</div>
            <div className="stat-label">Aprobadas</div>
          </div>
          <div className="stat stat-attempted">
            <div className="stat-value">{attempted}</div>
            <div className="stat-label">Intentadas</div>
          </div>
          <div className="stat stat-read">
            <div className="stat-value">{read}</div>
            <div className="stat-label">Leídas</div>
          </div>
          <div className="stat stat-unstarted">
            <div className="stat-value">{unstarted}</div>
            <div className="stat-label">Sin iniciar</div>
          </div>
        </div>
        <div className="stats-actions">
          <button className="button-primary" onClick={() => navigate("/ruta")}>
            <Play size={16} strokeWidth={2} />
            Continuar aprendiendo
          </button>
        </div>
      </section>

      <section className="card levels-list-card">
        <div className="card-header-with-tabs">
          <h2 className="card-title">Niveles del programa</h2>
          <Activity size={14} strokeWidth={2} />
        </div>
        <div className="levels-grid">
          {levels.map((level) => (
            <article key={level.id} className="level-card">
              <div className="level-card-header">
                <div className="level-card-order">Nivel {level.order}</div>
                <div className="level-card-progress">
                  <span className="progress-text">0 / 0 completadas</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
              <h3 className="level-card-title">{level.title}</h3>
              <p className="level-card-description">{level.description}</p>
              <div className="level-card-meta">
                <span className="meta-item">{level.prerequisites.length > 0 ? "Requiere nivel previo" : "Disponible"}</span>
              </div>
              <Link to="/ruta" className="level-card-button">
                <Play size={14} strokeWidth={2} />
                <span>Ver módulos</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
