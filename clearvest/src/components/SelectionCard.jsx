import { ShieldCheck, TrendingUp, Home, Sun, Clock, Calendar, Leaf } from 'lucide-react';

const ICON_MAP = {
  Home,
  Sun,
  TrendingUp,
  ShieldCheck,
  Clock,
  Calendar,
  Leaf,
};

export default function SelectionCard({
  title,
  subtitle,
  iconName,
  borderColor,
  isSelected,
  onClick,
  delay = 0,
}) {
  const Icon = iconName ? ICON_MAP[iconName] : null;

  // Map border color names to Tailwind classes
  const borderClasses = {
    green: 'border-l-emerald-500',
    yellow: 'border-l-amber-400',
    red: 'border-l-rose-500',
    brand: 'border-l-brand-500',
  };

  const selectedBgClasses = {
    green: 'bg-emerald-50',
    yellow: 'bg-amber-50',
    red: 'bg-rose-50',
    brand: 'bg-brand-50',
  };

  const iconColorClasses = {
    green: 'text-emerald-600',
    yellow: 'text-amber-500',
    red: 'text-rose-500',
    brand: 'text-brand-600',
  };

  const borderClass = borderClasses[borderColor] || 'border-l-brand-500';
  const selectedBg = isSelected ? (selectedBgClasses[borderColor] || 'bg-brand-50') : 'bg-white';
  const iconColor = iconColorClasses[borderColor] || 'text-brand-600';

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-6 rounded-2xl border-l-4 ${borderClass}
        border border-gray-100
        ${selectedBg}
        ${isSelected ? 'card-selected ring-2 ring-brand-400/30' : ''}
        card-glow cursor-pointer
        transition-all duration-300
        animate-slide-up
        group
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        {Icon && (
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isSelected ? selectedBgClasses[borderColor] || 'bg-brand-100' : 'bg-gray-50'}
            transition-colors duration-300 group-hover:scale-105 transform
          `}>
            <Icon
              className={`w-6 h-6 ${isSelected ? iconColor : 'text-gray-400'} transition-colors duration-300 group-hover:${iconColor}`}
              strokeWidth={2}
            />
          </div>
        )}

        {/* Color dot (for risk cards without icons) */}
        {!Icon && borderColor && (
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isSelected ? selectedBgClasses[borderColor] : 'bg-gray-50'}
            transition-colors duration-300
          `}>
            <div className={`w-5 h-5 rounded-full ${
              borderColor === 'green' ? 'bg-emerald-500' :
              borderColor === 'yellow' ? 'bg-amber-400' :
              borderColor === 'red' ? 'bg-rose-500' :
              'bg-brand-500'
            }`} />
          </div>
        )}

        {/* Text */}
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'} transition-colors duration-300`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Selected checkmark */}
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-300
          ${isSelected
            ? 'border-brand-600 bg-brand-600 scale-100'
            : 'border-gray-200 scale-90'}
        `}>
          {isSelected && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
