import { useEffect, useState } from 'react';

export default function HealthScore({ score = 74 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Determine color based on score
  const getColor = (s) => {
    if (s >= 70) return { stroke: '#22c55e', text: 'text-emerald-500', bg: 'bg-emerald-50', label: 'text-emerald-600' };
    if (s >= 50) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-50', label: 'text-amber-600' };
    return { stroke: '#ef4444', text: 'text-rose-500', bg: 'bg-rose-50', label: 'text-rose-600' };
  };

  const color = getColor(score);

  // Animate the score counting up
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // SVG circle math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // Get message based on score
  const getMessage = (s) => {
    if (s >= 70) return "Your portfolio is doing well! Small adjustments can make it even better.";
    if (s >= 50) return "Your portfolio is okay, but there's room for improvement.";
    return "Your portfolio needs attention. Let's look at ways to strengthen it.";
  };

  return (
    <div className={`rounded-3xl ${color.bg} border border-gray-100 p-8 animate-slide-up`}>
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <svg width="168" height="168" viewBox="0 0 168 168">
            {/* Background circle */}
            <circle
              cx="84"
              cy="84"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
              opacity="0.3"
            />
            {/* Animated progress circle */}
            <circle
              cx="84"
              cy="84"
              r={radius}
              fill="none"
              stroke={color.stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 84 84)"
              className="transition-all duration-300"
              style={{ filter: `drop-shadow(0 0 6px ${color.stroke}40)` }}
            />
          </svg>
          {/* Score text centered in circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold ${color.text}`}>
              {animatedScore}
            </span>
            <span className="text-sm text-gray-400 font-medium">/ 100</span>
          </div>
        </div>

        {/* Label + description */}
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Your Portfolio Health</h3>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.label} mb-3`}>
            {score >= 70 ? '● Healthy' : score >= 50 ? '● Moderate' : '● Needs Attention'}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            {getMessage(score)}
          </p>
        </div>
      </div>
    </div>
  );
}
