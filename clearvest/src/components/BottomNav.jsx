import { LayoutDashboard, GitBranch, Target } from 'lucide-react';
import { useInvestor } from '../context/InvestorContext';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'whatif',    label: 'What-If',    icon: GitBranch },
  { id: 'plan',      label: 'My Plan',    icon: Target },
];

export default function BottomNav() {
  const { activeTab, navigateTab } = useInvestor();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-100">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => navigateTab(id)}
              className={`
                flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl
                transition-all duration-300 cursor-pointer min-w-[72px]
                ${isActive
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className={`text-[11px] font-semibold tracking-wide ${isActive ? 'text-brand-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {/* Active dot indicator */}
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-brand-500 -mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
      {/* Safe area spacer for mobile */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
