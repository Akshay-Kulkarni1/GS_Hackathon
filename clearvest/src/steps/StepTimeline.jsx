import SelectionCard from '../components/SelectionCard';
import { useInvestor } from '../context/InvestorContext';

const TIMELINE_OPTIONS = [
  {
    value: 'short',
    title: 'Within 2 Years',
    subtitle: 'I need this money soon',
    iconName: 'Clock',
    borderColor: 'brand',
  },
  {
    value: 'medium',
    title: '3 to 5 Years',
    subtitle: 'I can wait a little while',
    iconName: 'Calendar',
    borderColor: 'brand',
  },
  {
    value: 'long',
    title: '10 Years or More',
    subtitle: "I'm thinking long-term",
    iconName: 'Leaf',
    borderColor: 'brand',
  },
];

export default function StepTimeline({ onNext }) {
  const { answers, setAnswer } = useInvestor();

  const handleSelect = (value) => {
    setAnswer('timeline', value);
    setTimeout(() => onNext(), 350);
  };

  return (
    <div className="animate-fade-in">
      {/* Question */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your timeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          When will you need this money?
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          This helps us pick the right mix for you.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {TIMELINE_OPTIONS.map((option, i) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            subtitle={option.subtitle}
            iconName={option.iconName}
            borderColor={option.borderColor}
            isSelected={answers.timeline === option.value}
            onClick={() => handleSelect(option.value)}
            delay={i * 100}
          />
        ))}
      </div>
    </div>
  );
}
