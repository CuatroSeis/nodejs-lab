import { Link } from "react-router-dom";
import { Play, FileText } from "lucide-react";
import LessonCard from "./LessonCard";

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: Array<{ id: string; title: string; status: string; order: number; estimatedMinutes: number }>;
  };
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const total = module.lessons.length;
  const approved = module.lessons.filter((l) => l.status === "approved").length;
  const progress = total === 0 ? 0 : Math.round((approved / total) * 100);

  return (
    <section className="module-card">
      <div className="module-card-header">
        <div className="module-card-order">Módulo {module.order}</div>
        <div className="module-card-progress">
          <span className="progress-text">{approved} / {total} completadas</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <h3 className="module-card-title">{module.title}</h3>
      <p className="module-card-description">{module.description}</p>
      <div className="module-card-lessons">
        {module.lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
      {module.lessons.length > 0 && (
        <Link to={`/modulo/${module.id}`} className="module-card-link">
          <FileText size={14} strokeWidth={2} />
          Ver todas las lecciones
        </Link>
      )}
    </section>
  );
}
