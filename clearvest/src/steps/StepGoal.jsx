import SelectionCard from '../components/SelectionCard';
import { useInvestor } from '../context/InvestorContext';

const GOAL_OPTIONS = [
  {
    value: 'home',
    title: 'Buy a Home',
    subtitle: 'Save up for your dream place',
    iconName: 'Home',
    borderColor: 'brand',
  },
  {
    value: 'retire',
    title: 'Retire Comfortably',
    subtitle: 'Build long-term financial freedom',
    iconName: 'Sun',
    borderColor: 'brand',
  },
  {
    value: 'growth',
    title: 'Grow My Wealth',
    subtitle: 'Make your money work harder',
    iconName: 'TrendingUp',
    borderColor: 'brand',
  },
  {
    value: 'emergency',
    title: 'Build an Emergency Fund',
    subtitle: "Be ready for life's surprises",
    iconName: 'ShieldCheck',
    borderColor: 'brand',
  },
];

export default function StepGoal({ onNext }) {
  const { answers, setAnswer } = useInvestor();

  const handleSelect = (value) => {
    setAnswer('goal', value);
    setTimeout(() => onNext(), 350);
  };

  return (
    <div className="animate-fade-in">
      {/* Question */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your main goal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          What is your goal?
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          Pick the one that matters most to you right now.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {GOAL_OPTIONS.map((option, i) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            subtitle={option.subtitle}
            iconName={option.iconName}
            borderColor={option.borderColor}
            isSelected={answers.goal === option.value}
            onClick={() => handleSelect(option.value)}
            delay={i * 100}
          />
        ))}
      </div>
    </div>
  );
}
