import { TrendingUp, ArrowRight, Wallet, BarChart3, Hand, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useInvestor } from '../context/InvestorContext';
import BottomNav from '../components/BottomNav';
import HealthScore from '../components/HealthScore';
import HoldingCard from '../components/HoldingCard';

// ── Asset allocation donut data ─────────────────────
const DEFAULT_ALLOCATION_DATA = [
  { name: 'Stocks',       value: 40, key: 'stocks' },
  { name: 'Mutual Funds', value: 45, key: 'mutualFunds' },
  { name: 'Bonds',        value: 10, key: 'bonds' },
  { name: 'Cash',         value: 5,  key: 'cash' },
];

const DONUT_COLORS = ['#4c6ef5', '#22c55e', '#f59e0b', '#a78bfa'];

const LEGEND_ITEMS = [
  { label: 'Stocks',       color: '#4c6ef5', desc: 'Pieces of companies that can grow in value' },
  { label: 'Mutual Funds', color: '#22c55e', desc: 'Pre-mixed bundles managed by experts' },
  { label: 'Bonds',        color: '#f59e0b', desc: 'Steady, reliable returns with low risk' },
  { label: 'Cash',         color: '#a78bfa', desc: 'Money you can access right away' },
];

// ── Holdings data ───────────────────────────────────
const STOCKS = [
  { name: 'TechCorp Inc',    value: 4200, change: 12,  status: 'great' },
  { name: 'StableBank Ltd',  value: 3100, change: 3,   status: 'steady' },
  { name: 'GreenEnergy Co',  value: 2800, change: -5,  status: 'watch' },
  { name: 'RetailGiant Inc', value: 1900, change: 7,   status: 'great' },
  { name: 'PharmaPlus',      value: 2100, change: -2,  status: 'watch' },
];

const MUTUAL_FUNDS = [
  { name: 'Bluechip Growth Fund',   value: 5500, change: 9,  status: 'great' },
  { name: 'Debt Shield Fund',       value: 4000, change: 4,  status: 'steady' },
  { name: 'Emerging Markets Fund',  value: 3400, change: 15, status: 'great' },
];

// ── Greeting helper ─────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Custom tooltip ──────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100">
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-500">{value}% of your money</p>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────
export default function PortfolioScreen() {
  const { profile, allocation, setCurrentScreen, setActiveTab, navigateTab } = useInvestor();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-base font-semibold text-gray-700">Setting up your dashboard...</p>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setCurrentScreen('onboarding');
            }}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Complete Setup
          </button>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <Loader className="w-5 h-5 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const greeting = getGreeting();
  const allocationData = allocation
    ? [
        { name: 'Stocks', value: allocation.stocks, key: 'stocks' },
        { name: 'Mutual Funds', value: allocation.mutualFunds, key: 'mutualFunds' },
        { name: 'Bonds', value: allocation.bonds, key: 'bonds' },
        { name: 'Cash', value: allocation.cash, key: 'cash' },
      ]
    : DEFAULT_ALLOCATION_DATA;

  return (
    <div className="min-h-screen bg-gray-50/40 flex flex-col pb-24">
      {/* ───── Header ───── */}
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
            onClick={() => {
              setActiveTab('dashboard');
              setCurrentScreen('onboarding');
            }}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Edit Profile
          </button>
        </div>
      </header>

      {/* ───── Main content ───── */}
      <main className="flex-1 px-5 pt-8 pb-6">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ── Greeting + Portfolio Value ── */}
          <div className="animate-fade-in">
            <p className="text-gray-400 text-sm font-medium mb-1">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 inline-flex items-center gap-3">
              {profile.name}!
              <Hand className="w-7 h-7 text-amber-400" strokeWidth={1.8} />
            </h1>

            {/* Value cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total value */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-brand-600" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-gray-400">Total Money Value</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">$28,000</p>
              </div>

              {/* Overall gain */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-gray-400">Total Gain So Far</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">+$3,200</p>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                    +12.9%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Health Score ── */}
          <HealthScore score={74} />

          {/* ── Asset Allocation Donut ── */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">How Your Money Is Split</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Donut chart */}
              <div>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={entry.key} fill={DONUT_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3">
                {LEGEND_ITEMS.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900">{allocationData[i].value}%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Stocks Holdings ── */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Company Shares</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {STOCKS.length} holdings
              </span>
            </div>
            <div className="space-y-3">
              {STOCKS.map((stock, i) => (
                <HoldingCard
                  key={stock.name}
                  name={stock.name}
                  value={stock.value}
                  change={stock.change}
                  status={stock.status}
                  delay={i * 80}
                />
              ))}
            </div>
          </div>

          {/* ── Mutual Funds Holdings ── */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Managed Funds</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {MUTUAL_FUNDS.length} holdings
              </span>
            </div>
            <div className="space-y-3">
              {MUTUAL_FUNDS.map((fund, i) => (
                <HoldingCard
                  key={fund.name}
                  name={fund.name}
                  value={fund.value}
                  change={fund.change}
                  status={fund.status}
                  delay={i * 80}
                />
              ))}
            </div>
          </div>

          {/* ── "See what could happen" CTA ── */}
          <div className="pt-4 animate-fade-in">
            <button
              id="see-whatif-btn"
              onClick={() => navigateTab('whatif')}
              className="
                w-full flex items-center justify-center gap-3
                px-8 py-5 rounded-2xl
                bg-gradient-to-r from-brand-600 to-brand-700
                text-white font-semibold text-lg
                shadow-lg shadow-brand-200/50
                hover:shadow-xl hover:shadow-brand-300/50
                hover:from-brand-700 hover:to-brand-800
                transform hover:-translate-y-0.5
                transition-all duration-300
                cursor-pointer
                group
              "
            >
              See what could happen
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-300 pb-4">
            This app is a helpful guide, not personalized professional advice.
          </p>

        </div>
      </main>

      {/* ───── Bottom Nav ───── */}
      <BottomNav />
    </div>
  );
}
