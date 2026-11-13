import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({ label, value, subtitle, icon: Icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ color: color || "var(--accent)" }}>
          <Icon size={18} strokeWidth={2} />
        </div>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
    </div>
  );
}
