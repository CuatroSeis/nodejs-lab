interface ProgressBarProps {
  percentage: number;
  label?: string;
  value?: string;
}

export default function ProgressBar({ percentage, label, value }: ProgressBarProps) {
  return (
    <div className="progress-card">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="progress-value">
        {value ?? `${percentage}%`}
      </div>
    </div>
  );
}
