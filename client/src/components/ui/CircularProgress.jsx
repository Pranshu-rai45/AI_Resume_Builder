// Circular progress indicator for ATS score
const CircularProgress = ({ value = 0, size = 120, strokeWidth = 10, label = '', color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (score) => {
    if (color) return color;
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // amber
    if (score >= 40) return '#F97316'; // orange
    return '#EF4444'; // red
  };

  const scoreColor = getColor(value);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ position: 'absolute' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.2s ease, stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${scoreColor}60)`
          }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="font-bold" style={{ fontSize: size * 0.22, color: scoreColor }}>{value}</span>
        {label && <span className="text-xs text-slate-500 mt-0.5">{label}</span>}
      </div>
    </div>
  );
};

export default CircularProgress;
