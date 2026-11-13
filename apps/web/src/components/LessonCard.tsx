import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Play, LucideIcon } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  unstarted: { label: "Sin iniciar", color: "#47526a", icon: Clock },
  read: { label: "Leída", color: "#60a5fa", icon: Play },
  attempted: { label: "Intentada", color: "#fbbf24", icon: Clock },
  approved: { label: "Aprobada", color: "#6ee7b7", icon: CheckCircle2 },
};

interface LessonCardProps {
  lesson: { id: string; title: string; status: string; order: number; estimatedMinutes: number };
  onStart?: () => void;
}

export default function LessonCard({ lesson, onStart }: LessonCardProps) {
  const cfg = statusConfig[lesson.status] || statusConfig.unstarted;
  const Icon = cfg.icon;

  return (
    <article className="lesson-card">
      <div className="lesson-card-header">
        <div className="lesson-card-order">{lesson.order}</div>
        <div className="lesson-card-status">
          <Icon size={12} strokeWidth={2} className="status-icon" />
          <span className="status-label" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
      </div>
      <h3 className="lesson-card-title">{lesson.title}</h3>
      <div className="lesson-card-meta">
        <span className="meta-item">{lesson.estimatedMinutes} min</span>
      </div>
      {onStart && (
        <button
          className="lesson-card-button"
          onClick={onStart}
          title="Iniciar lección"
        >
          <Play size={14} strokeWidth={2} />
          <span>Iniciar</span>
        </button>
      )}
    </article>
  );
}
