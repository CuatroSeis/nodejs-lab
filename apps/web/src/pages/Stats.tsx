import { useParams } from "react-router-dom";
import { MOCK_LEVELS } from "../data/mock";
import { useProgress } from "../hooks/useProgress";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import ActivityChart from "../components/ActivityChart";
import { Play, Activity, Clock, Flame, TrendingUp, CheckCircle } from "lucide-react";

export default function Stats() {
  const { stats, progressByLesson, getAttempts, getActiveDays } = useProgress();
  const s = stats();

  const lessons = progressByLesson();
  const recentAttempts = getAttempts().slice(0, 10);
  const activeDays = getActiveDays();

  // Calcular actividad por día (últimos 30 días)
  const today = new Date();
  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last30Days.push(d.toISOString().slice(0, 10));
  }

  const counts: Record<string, number> = {};
  activeDays.forEach((day) => {
    counts[day] = (counts[day] ?? 0) + 1;
  });

  const maxCount = Math.max(1, ...Object.values(counts));

  // Progreso por nivel (usando MOCK_LEVELS como referencia de estructura)
  const levelProgress = MOCK_LEVELS.map((level) => {
    const levelLessons = lessons.filter((l) =>
      level.modules.some((m) => m.lessons.some((ml) => ml.id === l.lessonId))
    );
    const total = levelLessons.length;
    const approved = levelLessons.filter((l) => l.status === "approved").length;
    return {
      level: level.title,
      percentage: total === 0 ? 0 : Math.round((approved / total) * 100),
      approved,
      total,
    };
  });

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="page stats-page">
      <header className="page-header">
        <h1>Estadísticas</h1>
        <p className="page-subtitle">
          Tu progreso, tiempo invertido y actividad en el laboratorio de Node.js.
        </p>
      </header>

      {/* Métricas principales */}
      <div className="stats-grid">
        <StatCard
          label="Lecciones aprobadas"
          value={`${s.approved} / ${s.total}`}
          subtitle={`${s.percentage}% de avance`}
          icon={CheckCircle}
          color="var(--accent)"
        />
        <StatCard
          label="Tiempo invertido"
          value={formatTime(s.totalTimeSeconds)}
          subtitle="En todas las lecciones"
          icon={Clock}
          color="#60a5fa"
        />
        <StatCard
          label="Racha actual"
          value={s.currentStreak}
          subtitle="días activos consecutivos"
          icon={Flame}
          color="var(--warning)"
        />
        <StatCard
          label="Racha máxima"
          value={s.maxStreak}
          subtitle="días activos consecutivos"
          icon={TrendingUp}
          color="#60a5fa"
        />
      </div>

      {/* Progreso por nivel */}
      <section className="card">
        <h2 className="section-title">Progreso por nivel</h2>
        <div className="level-progress-list">
          {levelProgress.map((lp) => (
            <div key={lp.level} className="level-progress-item">
              <div className="level-progress-header">
                <span className="level-progress-title">{lp.level}</span>
                <span className="level-progress-value">{lp.percentage}%</span>
              </div>
              <ProgressBar
                percentage={lp.percentage}
                value={`${lp.approved} / ${lp.total} lecciones`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Gráfico de actividad */}
      <section className="card">
        <div className="card-header-with-tabs">
          <h2 className="section-title">Actividad reciente (30 días)</h2>
          <Activity size={14} strokeWidth={2} />
        </div>
        <ActivityChart days={last30Days} counts={counts} maxCount={maxCount} />
      </section>

      {/* Historial de intentos */}
      <section className="card">
        <h2 className="section-title">Historial de intentos</h2>
        {recentAttempts.length > 0 ? (
          <div className="attempts-table">
            <div className="attempts-header">
              <span>Lección</span>
              <span>Resultado</span>
              <span>Fecha</span>
            </div>
            <div className="attempts-rows">
              {recentAttempts.map((attempt) => (
                <div key={attempt.timestamp} className="attempt-row">
                  <span className="attempt-lesson">{attempt.lessonId}</span>
                  <span
                    className={`attempt-result ${attempt.result}`}
                  title={attempt.score !== undefined ? `Puntuación: ${attempt.score}%` : undefined}
                  >
                    {attempt.result === "approved"
                      ? "✓ Aprobado"
                      : attempt.result === "attempted"
                      ? "○ Intentado"
                      : "✗ Fallido"}
                  </span>
                  <span className="attempt-date">
                    {new Date(attempt.timestamp).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <Clock size={24} strokeWidth={2} style={{ color: "var(--text-muted)" }} />
            <p>No hay intentos registrados aún. Comienza una lección para generar actividad.</p>
          </div>
        )}
      </section>
    </div>
  );
}
