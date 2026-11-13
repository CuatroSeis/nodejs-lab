interface ActivityChartProps {
  days: string[]; // fechas YYYY-MM-DD de los últimos 30 días
  counts: Record<string, number>; // conteo de actividad por día
  maxCount: number;
}

export default function ActivityChart({ days, counts, maxCount }: ActivityChartProps) {
  const getColor = (count: number) => {
    if (count === 0) return "#161b22";
    if (count <= 2) return "#0e4429";
    if (count <= 4) return "#006d32";
    if (count <= 6) return "#26a641";
    return "#39d353";
  };

  return (
    <div className="activity-chart">
      <div className="activity-grid">
        {days.map((day) => {
          const count = counts[day] ?? 0;
          return (
            <div
              key={day}
              className="activity-cell"
              style={{ backgroundColor: getColor(count) }}
              title={`${day}: ${count} actividad${count !== 1 ? "es" : ""}`}
            />
          );
        })}
      </div>
      <div className="activity-labels">
        {days.filter((_, i) => i % 7 === 0).map((day) => (
          <span key={day} className="activity-label">
            {day.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}
