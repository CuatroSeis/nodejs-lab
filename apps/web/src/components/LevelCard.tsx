import { Link } from "react-router-dom";
import { Play, BookOpen } from "lucide-react";

interface LevelCardProps {
  level: {
    id: string;
    order: number;
    title: string;
    description: string;
    estimatedHours: number;
    isLocked?: boolean;
    progress?: { approved: number; total: number };
  };
}

export default function LevelCard({ level }: LevelCardProps) {
  const { approved = 0, total = 0 } = level.progress || {};
  const progress = total === 0 ? 0 : Math.round((approved / total) * 100);
  const isLocked = level.isLocked || false;

  return (
    <article className={`level-card ${isLocked ? "level-card-locked" : ""}`}>
      <div className="level-card-header">
        <div className="level-card-order">Nivel {level.order}</div>
        {isLocked ? (
          <div className="level-card-lock">Bloqueado</div>
        ) : (
          <div className="level-card-progress">
            <span className="progress-text">{approved} / {total} completadas</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
      <h3 className="level-card-title">{level.title}</h3>
      <p className="level-card-description">{level.description}</p>
      <div className="level-card-meta">
        <span className="meta-item">{level.estimatedHours} horas</span>
        <span className="meta-item">{total} lecciones</span>
      </div>
      {!isLocked && (
        <Link to="/ruta" className="level-card-button">
          <Play size={14} strokeWidth={2} />
          <span>Iniciar nivel</span>
        </Link>
      )}
      {isLocked && (
        <button className="level-card-button level-card-button-locked" disabled>
          <BookOpen size={14} strokeWidth={2} />
          <span>Completa el nivel anterior</span>
        </button>
      )}
    </article>
  );
}
