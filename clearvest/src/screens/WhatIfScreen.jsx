import { useState, useCallback, useEffect } from 'react';
import {
  TrendingDown, Flame, Wallet, TrendingUp,
  ArrowLeft, ArrowRight, Loader, Bot, RefreshCw, Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useInvestor } from '../context/InvestorContext';
import BottomNav from '../components/BottomNav';

// ─────────────────────────────────────────────────────
// CURRENT PORTFOLIO (matches Screen 2)
// ─────────────────────────────────────────────────────
const CURRENT = { stocks: 40, mutualFunds: 45, bonds: 10, cash: 5 };

const LABELS = { stocks: 'Stocks', mutualFunds: 'Mutual Funds', bonds: 'Bonds', cash: 'Cash' };
const COLORS = ['#4c6ef5', '#22c55e', '#f59e0b', '#a78bfa'];

// ─────────────────────────────────────────────────────
// SCENARIOS
// ─────────────────────────────────────────────────────
const SCENARIOS = [
  { id: 'crash',     icon: TrendingDown, label: 'The market crashes',      color: 'text-rose-500',    bg: 'bg-rose-50' },
  { id: 'inflation', icon: Flame,        label: 'Prices of everything go up', color: 'text-amber-500',   bg: 'bg-amber-50' },
  { id: 'cash',      icon: Wallet,       label: 'I need cash urgently',   color: 'text-purple-500',  bg: 'bg-purple-50' },
  { id: 'growth',    icon: TrendingUp,   label: 'I want faster growth',   color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const SEVERITIES = [
  { id: 'little', label: 'A Little' },
  { id: 'quite',  label: 'Quite a Bit' },
  { id: 'lot',    label: 'A Lot' },
];

// ─────────────────────────────────────────────────────
// REBALANCING DATA
// ─────────────────────────────────────────────────────
const REBALANCE = {
  'crash-little':     { stocks: 35, mutualFunds: 45, bonds: 15, cash: 5 },
  'crash-quite':      { stocks: 28, mutualFunds: 42, bonds: 22, cash: 8 },
  'crash-lot':        { stocks: 20, mutualFunds: 38, bonds: 30, cash: 12 },

  'inflation-little': { stocks: 45, mutualFunds: 40, bonds: 10, cash: 5 },
  'inflation-quite':  { stocks: 48, mutualFunds: 42, bonds: 5,  cash: 5 },
  'inflation-lot':    { stocks: 52, mutualFunds: 40, bonds: 3,  cash: 5 },

  'cash-little':      { stocks: 30, mutualFunds: 45, bonds: 10, cash: 15 },
  'cash-quite':       { stocks: 23, mutualFunds: 45, bonds: 10, cash: 22 },
  'cash-lot':         { stocks: 18, mutualFunds: 37, bonds: 15, cash: 30 },

  'growth-little':    { stocks: 48, mutualFunds: 42, bonds: 7,  cash: 3 },
  'growth-quite':     { stocks: 55, mutualFunds: 37, bonds: 5,  cash: 3 },
  'growth-lot':       { stocks: 63, mutualFunds: 33, bonds: 2,  cash: 2 },
};

// ─────────────────────────────────────────────────────
// ACTION SUGGESTIONS (plain English)
// ─────────────────────────────────────────────────────
const ACTIONS = {
  'crash-little': [
    'Move a small portion out of stocks into bonds for safety',
    'Keep your mutual funds as they are — they\'re already diversified',
    'Don\'t panic — small dips are normal and usually recover',
  ],
  'crash-quite': [
    'Reduce your stock holdings and shift to bonds for protection',
    'Slightly lower your mutual fund exposure for more stability',
    'Add a bit more to cash so you have a cushion if things get worse',
  ],
  'crash-lot': [
    'Significantly reduce stocks — protect what you have',
    'Move a big chunk into bonds for steady, reliable returns',
    'Build up your cash reserve for safety and buying opportunities later',
    'Scale back mutual funds slightly to stay balanced',
  ],
  'inflation-little': [
    'Add a bit more to stocks — companies can raise prices to keep up',
    'Slightly reduce mutual fund exposure',
    'Keep bonds and cash the same for now',
  ],
  'inflation-quite': [
    'Increase stocks — they tend to outpace rising prices',
    'Cut bonds in half — they lose value when prices rise fast',
    'Your mutual funds are doing fine, just a small trim',
  ],
  'inflation-lot': [
    'Go heavier into stocks — they\'re your best defense against rising prices',
    'Cut bonds to almost nothing — they get hurt the most',
    'Trim mutual funds slightly to fund your stock increase',
  ],
  'cash-little': [
    'Sell some stocks to free up cash you might need',
    'Keep your mutual funds and bonds — they\'re your safety net',
    'Having 15% in cash gives you room to breathe',
  ],
  'cash-quite': [
    'Sell more stocks to build a bigger cash cushion',
    'Keep bonds and mutual funds for longer-term stability',
    'With 22% in cash, you\'re ready for unexpected expenses',
  ],
  'cash-lot': [
    'Sell a significant amount of stocks for immediate cash',
    'Trim your mutual funds too — you need the liquidity',
    'Add a bit to bonds for safe, accessible savings',
    '30% cash ensures you can handle any emergency',
  ],
  'growth-little': [
    'Shift a bit from bonds and cash into stocks for more growth',
    'Slightly reduce mutual fund allocation to favor direct stocks',
    'You\'re not taking on too much extra risk — just a gentle push',
  ],
  'growth-quite': [
    'Move significantly into stocks for stronger returns',
    'Reduce bonds and cash to their minimum',
    'Trim mutual funds slightly in favor of individual stocks',
    'This is a bigger bet, but your timeline supports it',
  ],
  'growth-lot': [
    'Go heavy into stocks — this is maximum growth mode',
    'Minimize bonds and cash to just 2% each',
    'Shift some mutual fund money into direct stocks for more control',
    'This is aggressive — make sure your timeline is long enough',
  ],
};

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
function toChartData(alloc) {
  return Object.entries(alloc).map(([key, value]) => ({
    name: LABELS[key],
    value,
    key,
  }));
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg px-4 py-2.5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-800">{payload[0].payload.name}</p>
      <p className="text-sm text-gray-500">{payload[0].value}%</p>
    </div>
  );
}

function MiniDonut({ data, title }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-600 text-center mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={entry.key} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Inline mini legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 px-2">
        {data.map((item, i) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
            <span className="text-[11px] text-gray-500 font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────
export default function WhatIfScreen() {
  const { profile, answers, allocation, navigateTab, setCurrentScreen, setActiveTab } = useInvestor();
  const [isLoading, setIsLoading] = useState(true);

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState('Your advisor is taking a break. Try again in a moment.');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const currentAllocation = allocation || CURRENT;
  const rebalanceKey = selectedScenario && severity ? `${selectedScenario}-${severity}` : null;
  const suggested = rebalanceKey ? REBALANCE[rebalanceKey] : null;
  const actions = rebalanceKey ? ACTIONS[rebalanceKey] : [];

  // ── Groq AI call ──────────────────────────────────
  const fetchAiExplanation = useCallback(async () => {
    if (!profile || !selectedScenario || !severity || !suggested) return;
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    setAiLoading(true);
    setAiError(false);
    setAiErrorMessage('Your advisor is taking a break. Try again in a moment.');
    setAiResponse(null);

    if (!apiKey) {
      setAiError(true);
      setAiErrorMessage('AI Advisor unavailable. Add your API key to enable this feature.');
      setAiLoading(false);
      return;
    }

    const scenarioLabel = SCENARIOS.find(s => s.id === selectedScenario)?.label || selectedScenario;
    const severityLabel = SEVERITIES.find(s => s.id === severity)?.label || severity;
    const changes = Object.entries(suggested)
      .map(([k, v]) => `${LABELS[k]}: ${currentAllocation[k]}% → ${v}%`)
      .join(', ');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly financial advisor talking to a complete beginner. Always use simple words. Never use financial jargon. Talk like a helpful friend, not a banker. Keep it warm and reassuring.',
            },
            {
              role: 'user',
              content: `The investor profile is: ${profile.name} (${profile.desc}). Their risk level is ${answers.risk}, goal is ${answers.goal}, and timeline is ${answers.timeline}. They selected this scenario: "${scenarioLabel}" at severity: "${severityLabel}". The suggested money mix changes are: ${changes}. Explain in 3-4 simple sentences why these changes make sense for them personally.`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response');
      setAiResponse(text);
    } catch {
      setAiError(true);
      setAiErrorMessage('Your advisor is taking a break. Try again in a moment.');
    } finally {
      setAiLoading(false);
    }
  }, [profile, answers, selectedScenario, severity, suggested, currentAllocation]);

  // ── Handle scenario selection ─────────────────────
  const handleScenario = (id) => {
    setSelectedScenario(id);
    setSeverity(null);
    setAiResponse(null);
    setAiError(false);
    setAiErrorMessage('Your advisor is taking a break. Try again in a moment.');
  };

  // ── Handle severity selection ─────────────────────
  const handleSeverity = (id) => {
    setSeverity(id);
    setAiResponse(null);
    setAiError(false);
    setAiErrorMessage('Your advisor is taking a break. Try again in a moment.');
  };

  // ── Auto-fetch AI when both are set ───────────────
  // We don't auto-fetch — the user sees charts + actions first,
  // then the AI box appears with a "Get AI advice" button or auto-loads.
  const shouldShowResults = selectedScenario && severity && suggested;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <Loader className="w-5 h-5 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Loading your scenario tool...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-base font-semibold text-gray-700">Please complete your profile first</p>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setCurrentScreen('onboarding');
            }}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Go to Setup
          </button>
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

      {/* ── Main Content ── */}
      <main className="flex-1 px-5 pt-8 pb-6">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ── Title ── */}
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">What Could Happen?</h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              {profile.name}, see how different situations could affect your money and what you can do next.
            </p>
          </div>

          {/* ── Scenario Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-up">
            {SCENARIOS.map((s, i) => {
              const Icon = s.icon;
              const isActive = selectedScenario === s.id;
              return (
                <button
                  key={s.id}
                  id={`scenario-${s.id}`}
                  onClick={() => handleScenario(s.id)}
                  className={`
                    flex items-center gap-4 p-5 rounded-2xl border-2 text-left
                    transition-all duration-300 cursor-pointer card-glow
                    animate-slide-up
                    ${isActive
                      ? 'border-brand-500 bg-brand-50/50 shadow-md shadow-brand-100'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                    }
                  `}
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                >
                  <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${s.color}`} strokeWidth={2} />
                  </div>
                  <span className={`font-semibold text-base ${isActive ? 'text-brand-700' : 'text-gray-700'}`}>
                    {s.label}
                  </span>
                  {/* Selected indicator */}
                  {isActive && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Severity Selector ── */}
          {selectedScenario && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold text-gray-500 text-center mb-4">How much?</p>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {SEVERITIES.map((s) => {
                  const isActive = severity === s.id;
                  return (
                    <button
                      key={s.id}
                      id={`severity-${s.id}`}
                      onClick={() => handleSeverity(s.id)}
                      className={`
                        px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold
                        transition-all duration-300 cursor-pointer
                        ${isActive
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-300 hover:text-brand-600'
                        }
                      `}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Results Section ── */}
          {shouldShowResults && (
            <div className="space-y-6 animate-fade-in">

              {/* ── Side-by-side Donut Charts ── */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <h3 className="text-base font-bold text-gray-800">How Your Mix Would Change</h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <MiniDonut data={toChartData(currentAllocation)} title="Your money mix now" />

                  {/* Arrow between */}
                  <div className="flex items-center justify-center sm:py-12">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-gray-300 sm:rotate-0 rotate-90" />
                    </div>
                  </div>

                  <MiniDonut data={toChartData(suggested)} title="Suggested money mix" />
                </div>

                {/* Change summary chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-5 pt-5 border-t border-gray-50">
                  {Object.entries(suggested).map(([key, val], i) => {
                    const diff = val - currentAllocation[key];
                    if (diff === 0) return null;
                    return (
                      <span
                        key={key}
                        className={`
                          inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                          ${diff > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}
                        `}
                      >
                        {LABELS[key]}: {diff > 0 ? '+' : ''}{diff}%
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* ── Action List ── */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-base font-bold text-gray-800 mb-4">What we suggest</h3>
                <ul className="space-y-3">
                  {actions.map((action, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 animate-slide-up"
                      style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-brand-600">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{action}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── AI Advisor Box ── */}
              <div className="bg-gradient-to-br from-brand-50/80 to-white rounded-2xl p-6 sm:p-8 border border-brand-100/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Your AI Advisor says...</h3>
                    <p className="text-xs text-gray-400">Personalized for your profile</p>
                  </div>
                </div>

                {/* States: idle / loading / response / error */}
                {!aiResponse && !aiLoading && !aiError && (
                  <button
                    id="get-ai-advice-btn"
                    onClick={fetchAiExplanation}
                    className="
                      w-full flex items-center justify-center gap-2
                      px-6 py-4 rounded-2xl
                      bg-white border-2 border-dashed border-brand-200
                      text-brand-600 font-semibold text-sm
                      hover:bg-brand-50 hover:border-brand-300
                      transition-all duration-300
                      cursor-pointer
                    "
                  >
                    <Sparkles className="w-4 h-4" />
                    Get personalized advice from AI
                  </button>
                )}

                {aiLoading && (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader className="w-5 h-5 text-brand-500 animate-spin" />
                    <span className="text-sm text-gray-400 font-medium">Thinking about your situation...</span>
                  </div>
                )}

                {aiResponse && (
                  <div className="animate-fade-in">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {aiResponse}
                    </p>
                    <button
                      onClick={fetchAiExplanation}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-600 font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Ask again
                    </button>
                  </div>
                )}

                {aiError && (
                  <div className="flex flex-col items-center gap-3 py-6 animate-fade-in">
                    <p className="text-sm text-gray-400">{aiErrorMessage}</p>
                    <button
                      onClick={fetchAiExplanation}
                      className="
                        inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                        bg-white border border-gray-200
                        text-gray-600 font-medium text-sm
                        hover:border-brand-300 hover:text-brand-600
                        transition-all duration-300 cursor-pointer
                      "
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── Empty state when no scenario selected ── */}
          {!selectedScenario && (
            <div className="text-center py-8 animate-fade-in">
              <p className="text-sm text-gray-300">Pick a scenario above to see what would happen</p>
            </div>
          )}

          {/* ── State when scenario selected but no severity ── */}
          {selectedScenario && !severity && (
            <div className="text-center py-8 animate-fade-in">
              <p className="text-sm text-gray-300">Choose how much to see the impact</p>
            </div>
          )}

        </div>
      </main>

      {/* ── Bottom Nav ── */}
      <BottomNav />
    </div>
  );
}
