import { useEffect, useState } from 'react';
import {
  Shield, Target, Clock, Calendar, Leaf, Home, Sun, TrendingUp,
  CheckCircle2, Lightbulb, ArrowRight, ArrowLeft, Sparkles, Loader,
} from 'lucide-react';
import { useInvestor } from '../context/InvestorContext';
import BottomNav from '../components/BottomNav';

// ── Map onboarding answers to user-friendly labels + icons ──
const RISK_MAP = {
  safe: { label: 'Safe', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  middle: { label: 'Balanced', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  bold: { label: 'Bold', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
};

const GOAL_MAP = {
  home: { label: 'Home', icon: Home, color: 'text-brand-600', bg: 'bg-brand-50' },
  retire: { label: 'Retire', icon: Sun, color: 'text-brand-600', bg: 'bg-brand-50' },
  growth: { label: 'Growth', icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50' },
  emergency: { label: 'Emergency', icon: Shield, color: 'text-brand-600', bg: 'bg-brand-50' },
};

const TIMELINE_MAP = {
  short: { label: '2 years', icon: Clock, color: 'text-brand-600', bg: 'bg-brand-50' },
  medium: { label: '5 years', icon: Calendar, color: 'text-brand-600', bg: 'bg-brand-50' },
  long: { label: '10 years', icon: Leaf, color: 'text-brand-600', bg: 'bg-brand-50' },
};

// ── Profile-aware tips ──────────────────────────────
function getTips(risk, goal, timeline) {
  const tips = [];
  if (risk === 'safe') tips.push('Keep most of your money in safer options so big market moves do not shake your plan.');
  if (risk === 'middle') tips.push('Use a balanced mix so your money can grow while still feeling steady.');
  if (risk === 'bold') tips.push('Because you chose bold, keep a small safety cushion so you can stay calm in rough weeks.');

  if (goal === 'home' && timeline === 'short') tips.push('Since you want a home soon, keep at least 20% in safe, easy-to-access funds.');
  if (goal === 'retire') tips.push('For retirement, add money on a schedule so progress stays steady month after month.');
  if (goal === 'growth') tips.push('For growth, spread money across different types of funds so one drop does not hurt everything.');
  if (goal === 'emergency') tips.push('For an emergency goal, build a cash buffer first, then add small growth options later.');

  if (timeline === 'long') tips.push('You have time on your side, so consistency matters more than short-term noise.');
  if (timeline !== 'long') tips.push('Because your timeline is closer, review your money mix every month and keep it simple.');

  return tips.slice(0, 3);
}

// ── Next steps based on profile ─────────────────────
function getNextSteps(risk, goal, timeline) {
  const firstStep = goal === 'home'
    ? { text: 'Open a dedicated home savings bucket and set an automatic weekly transfer.', icon: Home }
    : goal === 'retire'
      ? { text: 'Increase your retirement contribution by a small amount this month.', icon: Sun }
      : goal === 'growth'
        ? { text: 'Start a simple recurring investment so your money grows consistently.', icon: TrendingUp }
        : { text: 'Build your emergency cash target first before taking extra risk.', icon: Shield };

  const secondStep = risk === 'bold'
    ? { text: 'Use the What Could Happen tool to stress-test your plan once a month.', icon: Target }
    : { text: 'Keep your mix close to your comfort level and avoid sudden changes.', icon: Target };

  const thirdStep = timeline === 'short'
    ? { text: 'Check progress every month and keep enough cash ready for near-term needs.', icon: Clock }
    : { text: 'Check progress every quarter and stay consistent with your contributions.', icon: Calendar };

  return [firstStep, secondStep, thirdStep];
}

// ── Main Component ──────────────────────────────────
export default function PlanScreen() {
  const { profile, answers, navigateTab } = useInvestor();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!profile || !answers.risk || !answers.goal || !answers.timeline) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex flex-col pb-24">
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Clear<span className="text-brand-600">Vest</span>
            </span>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center animate-fade-in">
            <Target className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">Complete the quiz first to see your plan.</p>
            <button
              onClick={() => navigateTab('dashboard')}
              className="mt-4 text-brand-600 font-medium text-sm hover:underline cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const riskInfo = RISK_MAP[answers.risk];
  const goalInfo = GOAL_MAP[answers.goal];
  const timelineInfo = TIMELINE_MAP[answers.timeline];
  const tips = getTips(answers.risk, answers.goal, answers.timeline);
  const nextSteps = getNextSteps(answers.risk, answers.goal, answers.timeline);

  const RiskIcon = riskInfo.icon;
  const GoalIcon = goalInfo.icon;
  const TimelineIcon = timelineInfo.icon;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <Loader className="w-5 h-5 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Loading your personal plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40 flex flex-col pb-24">
      {/* ── Header ── */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Clear<span className="text-brand-600">Vest</span>
            </span>
          </div>
          <button
            onClick={() => navigateTab('dashboard')}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 px-5 pt-8 pb-6">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ── Title + Profile ── */}
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Personal Plan</h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {profile.name}: {profile.desc}
            </p>
          </div>

          {/* ── Profile Card ── */}
          <div className="bg-gradient-to-br from-brand-50/80 to-white rounded-2xl p-6 sm:p-8 border border-brand-100/50 shadow-sm animate-slide-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-600" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500">{profile.desc}</p>
              </div>
            </div>
          </div>

          {/* ── Goal Cards ── */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <h3 className="text-base font-bold text-gray-700 mb-3">Your focus cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-4 rounded-2xl bg-white border ${riskInfo.border} shadow-sm`}>
                <div className={`w-10 h-10 rounded-xl ${riskInfo.bg} flex items-center justify-center mb-3`}>
                  <RiskIcon className={`w-5 h-5 ${riskInfo.color}`} strokeWidth={2} />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk level</p>
                <p className="text-base font-bold text-gray-800">{riskInfo.label}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${goalInfo.bg} flex items-center justify-center mb-3`}>
                  <GoalIcon className={`w-5 h-5 ${goalInfo.color}`} strokeWidth={2} />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main goal</p>
                <p className="text-base font-bold text-gray-800">{goalInfo.label}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${timelineInfo.bg} flex items-center justify-center mb-3`}>
                  <TimelineIcon className={`w-5 h-5 ${timelineInfo.color}`} strokeWidth={2} />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timeline</p>
                <p className="text-base font-bold text-gray-800">{timelineInfo.label}</p>
              </div>
            </div>
          </div>

          {/* ── What We Recommend ── */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-gray-800">What we recommend for you</h3>
            </div>
            <ul className="space-y-4">
              {tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 animate-slide-up"
                  style={{ animationDelay: `${300 + i * 80}ms`, animationFillMode: 'both' }}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Your Next Steps ── */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-2 mb-5">
              <ArrowRight className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-gray-800">Your next steps</h3>
            </div>
            <div className="space-y-4">
              {nextSteps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-50 animate-slide-up"
                    style={{ animationDelay: `${400 + i * 80}ms`, animationFillMode: 'both' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <StepIcon className="w-5 h-5 text-brand-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700">Step {i + 1}</p>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── CTA to What-If ── */}
          <div className="pt-2 animate-fade-in">
            <button
              onClick={() => navigateTab('whatif')}
              className="
                w-full flex items-center justify-center gap-3
                px-8 py-4 rounded-2xl
                bg-white border-2 border-brand-200
                text-brand-600 font-semibold text-base
                hover:bg-brand-50 hover:border-brand-300
                transition-all duration-300
                cursor-pointer group
              "
            >
              Explore What-If scenarios
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-300 pb-4">
            This plan is a helpful starting point and should be adapted to your real-life needs.
          </p>

        </div>
      </main>

      {/* ── Bottom Nav ── */}
      <BottomNav />
    </div>
  );
}
