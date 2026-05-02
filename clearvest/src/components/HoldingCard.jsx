import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const BADGE_STYLES = {
  great:  { bg: 'bg-emerald-50',  text: 'text-emerald-700',  border: 'border-emerald-100', label: 'Doing Great' },
  steady: { bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-amber-100',   label: 'Steady' },
  watch:  { bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-amber-100',   label: 'Keep an Eye' },
  down:   { bg: 'bg-rose-50',     text: 'text-rose-700',     border: 'border-rose-100',    label: 'Struggling' },
};

export default function HoldingCard({ name, value, change, status, delay = 0 }) {
  const badge = BADGE_STYLES[status] || BADGE_STYLES.steady;
  const isPositive = change >= 0;

  const TrendIcon = change > 5 ? TrendingUp : change < -3 ? TrendingDown : Minus;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 card-glow animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Trend icon circle */}
      <div className={`
        w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
        ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}
      `}>
        <TrendIcon
          className={`w-5 h-5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}
          strokeWidth={2}
        />
      </div>

      {/* Name + badge */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
        <span className={`
          inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border
          ${badge.bg} ${badge.text} ${badge.border}
        `}>
          {badge.label}
        </span>
      </div>

      {/* Value + change */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-gray-900 text-sm">
          ${value.toLocaleString()}
        </p>
        <p className={`text-xs font-semibold mt-0.5 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </p>
      </div>
    </div>
  );
}
