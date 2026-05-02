import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useInvestor } from '../context/InvestorContext';

// Risk badge colors
const RISK_STYLES = {
  safe:   { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Low Risk' },
  middle: { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Moderate Risk' },
  bold:   { bg: 'bg-rose-50',    text: 'text-rose-700',     label: 'High Growth' },
};

const GOAL_LABELS = {
  home: 'Buy a Home',
  retire: 'Retire Comfortably',
  growth: 'Grow My Wealth',
  emergency: 'Emergency Fund',
};

const TIMELINE_LABELS = {
  short: 'Within 2 years',
  medium: '3–5 years',
  long: '10+ years',
};

export default function ResultScreen() {
  const { profile, answers, navigateTab, resetAnswers } = useInvestor();

  if (!profile) return null;

  const riskStyle = RISK_STYLES[answers.risk] || RISK_STYLES.middle;

  return (
    <div className="animate-fade-in text-center">
      {/* Celebration header */}
      <div className="animate-celebrate">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-200">
          <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 mb-2">
          Your money style
        </p>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {profile.name}
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-md mx-auto leading-relaxed">
          {profile.desc}
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8 mb-10">
        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${riskStyle.bg} ${riskStyle.text}`}>
          {riskStyle.label}
        </span>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600">
          {GOAL_LABELS[answers.goal]}
        </span>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600">
          {TIMELINE_LABELS[answers.timeline]}
        </span>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
        <button
          id="view-portfolio-btn"
          onClick={() => navigateTab('dashboard')}
          className="
            w-full sm:w-auto inline-flex items-center justify-center gap-2
            px-8 py-4 rounded-2xl
            bg-gradient-to-r from-brand-600 to-brand-700
            text-white font-semibold text-lg
            shadow-lg shadow-brand-200
            hover:shadow-xl hover:shadow-brand-300
            hover:from-brand-700 hover:to-brand-800
            transform hover:-translate-y-0.5
            transition-all duration-300
            cursor-pointer
          "
        >
          View My Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          id="retake-quiz-btn"
          onClick={resetAnswers}
          className="
            w-full sm:w-auto inline-flex items-center justify-center gap-2
            px-6 py-4 rounded-2xl
            bg-gray-50 hover:bg-gray-100
            text-gray-600 font-medium text-base
            transition-all duration-300
            cursor-pointer
          "
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}
