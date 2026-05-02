import {
  Shield, Target, Clock, Calendar, Leaf, Home, Sun, TrendingUp,
  CheckCircle2, Lightbulb, ArrowRight, ArrowLeft, Sparkles,
} from 'lucide-react';
import { useInvestor } from '../context/InvestorContext';
import BottomNav from '../components/BottomNav';

// ── Map onboarding answers to user-friendly labels + icons ──
const RISK_MAP = {
  safe:   { label: 'Play it Safe',    icon: Shield,      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  middle: { label: 'Middle Ground',   icon: Target,      color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  bold:   { label: 'Go Bold',         icon: TrendingUp,  color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200' },
};

const GOAL_MAP = {
  home:      { label: 'Buy a Home',              icon: Home,       color: 'text-brand-600', bg: 'bg-brand-50' },
  retire:    { label: 'Retire Comfortably',       icon: Sun,        color: 'text-brand-600', bg: 'bg-brand-50' },
  growth:    { label: 'Grow My Wealth',           icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50' },
  emergency: { label: 'Build an Emergency Fund',  icon: Shield,     color: 'text-brand-600', bg: 'bg-brand-50' },
};

const TIMELINE_MAP = {
  short:  { label: 'Within 2 Years',   icon: Clock,    color: 'text-brand-600', bg: 'bg-brand-50' },
  medium: { label: '3 to 5 Years',     icon: Calendar, color: 'text-brand-600', bg: 'bg-brand-50' },
  long:   { label: '10 Years or More', icon: Leaf,     color: 'text-brand-600', bg: 'bg-brand-50' },
};

// ── Profile-aware tips ──────────────────────────────
function getTips(risk, goal, timeline) {
  const tips = [];

  // Risk-based tip
  if (risk === 'safe') {
    tips.push('Since you prefer safety, keep most of your money in steady, reliable options that won\'t bounce around too much.');
  } else if (risk === 'middle') {
    tips.push('You\'re comfortable with some ups and downs, so a healthy mix of growth and safety is the way to go.');
  } else {
    tips.push('You\'re ready for bigger swings in exchange for bigger potential rewards. Just make sure you won\'t need this money unexpectedly.');
  }

  // Goal-based tip
  if (goal === 'home') {
    if (timeline === 'short') tips.push('Since you want to buy a home soon, keep at least 20% in safe, easy-to-access savings so your down payment is ready when you are.');
    else if (timeline === 'medium') tips.push('With a few years before buying, you can grow your down payment fund while slowly shifting to safer options as you get closer.');
    else tips.push('You have time on your side for homeownership. Let your money grow for now, and we\'ll shift to safer ground as the purchase date nears.');
  } else if (goal === 'retire') {
    if (timeline === 'short') tips.push('Retirement is close, so focus on protecting what you\'ve built. Lean toward steady, reliable options that preserve your savings.');
    else if (timeline === 'medium') tips.push('With a few years until retirement, start gradually moving from growth-focused to more stable options.');
    else tips.push('Retirement is far off, so you can afford to focus on growth now. Time will smooth out the bumps along the way.');
  } else if (goal === 'growth') {
    if (timeline === 'short') tips.push('For short-term growth, focus on opportunities that can move quickly but keep some cash handy in case you need to pivot.');
    else if (timeline === 'medium') tips.push('A few years gives you room to ride out short-term dips while your money grows. Stay diversified.');
    else tips.push('Long-term growth is all about patience. Stay invested, stay diversified, and let time do the heavy lifting.');
  } else {
    if (timeline === 'short') tips.push('For a quick emergency fund, prioritize safe, instantly accessible savings. Every dollar counts right now.');
    else if (timeline === 'medium') tips.push('You\'ve got time to build a strong safety net. Mix mostly safe options with a small growth component.');
    else tips.push('A long-horizon emergency fund can afford some growth exposure. Keep the core in safe options and let the rest build value.');
  }

  // Universal tip
  tips.push('Check in on your plan every few months. Life changes, and your money plan should change with it.');

  return tips;
}

// ── Next steps based on profile ─────────────────────
function getNextSteps(risk, goal, timeline) {
  const steps = [];

  if (goal === 'home') {
    steps.push({ text: 'Set up automatic transfers to a dedicated "Home Fund" savings account', icon: Home });
  } else if (goal === 'retire') {
    steps.push({ text: 'Review your current retirement contributions and see if you can increase them', icon: Sun });
  } else if (goal === 'growth') {
    steps.push({ text: 'Start with a small amount in a diversified fund and add regularly', icon: TrendingUp });
  } else {
    steps.push({ text: 'Open a high-yield savings account and set up weekly automatic deposits', icon: Shield });
  }

  if (risk === 'bold') {
    steps.push({ text: 'Explore the What-If tool to stress-test your portfolio against market dips', icon: Target });
  } else {
    steps.push({ text: 'Review your current mix to make sure it matches your comfort level', icon: Target });
  }

  if (timeline === 'short') {
    steps.push({ text: 'Set calendar reminders to check your progress every month', icon: Clock });
  } else {
    steps.push({ text: 'Set calendar reminders to check your progress every quarter', icon: Calendar });
  }

  return steps;
}

// ── Main Component ──────────────────────────────────
export default function PlanScreen() {
  const { profile, answers, navigateTab } = useInvestor();

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
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              A roadmap built just for you, {profile.name}
            </p>
          </div>

          {/* ── Profile Card ── */}
          <div className="bg-gradient-to-br from-brand-50/80 to-white rounded-3xl p-6 sm:p-8 border border-brand-100/50 shadow-sm animate-slide-up">
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

          {/* ── Your Choices ── */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <h3 className="text-base font-bold text-gray-700 mb-3">Your choices</h3>

            {/* Risk */}
            <div className={`flex items-center gap-4 p-4 rounded-2xl bg-white border ${riskInfo.border} shadow-sm`}>
              <div className={`w-11 h-11 rounded-xl ${riskInfo.bg} flex items-center justify-center`}>
                <RiskIcon className={`w-5 h-5 ${riskInfo.color}`} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Level</p>
                <p className="text-sm font-bold text-gray-800">{riskInfo.label}</p>
              </div>
            </div>

            {/* Goal */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className={`w-11 h-11 rounded-xl ${goalInfo.bg} flex items-center justify-center`}>
                <GoalIcon className={`w-5 h-5 ${goalInfo.color}`} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Goal</p>
                <p className="text-sm font-bold text-gray-800">{goalInfo.label}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className={`w-11 h-11 rounded-xl ${timelineInfo.bg} flex items-center justify-center`}>
                <TimelineIcon className={`w-5 h-5 ${timelineInfo.color}`} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timeline</p>
                <p className="text-sm font-bold text-gray-800">{timelineInfo.label}</p>
              </div>
            </div>
          </div>

          {/* ── What We Recommend ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
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
            This plan is a starting point, not professional financial advice. Consider speaking with an advisor for personalized guidance.
          </p>

        </div>
      </main>

      {/* ── Bottom Nav ── */}
      <BottomNav />
    </div>
  );
}
