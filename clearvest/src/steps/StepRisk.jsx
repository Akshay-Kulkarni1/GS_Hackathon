import SelectionCard from '../components/SelectionCard';
import { useInvestor } from '../context/InvestorContext';

const RISK_OPTIONS = [
  {
    value: 'safe',
    title: 'Play it Safe',
    subtitle: "I don't want to lose any money",
    borderColor: 'green',
  },
  {
    value: 'middle',
    title: 'Middle Ground',
    subtitle: 'Some risk is okay',
    borderColor: 'yellow',
  },
  {
    value: 'bold',
    title: 'Go Bold',
    subtitle: 'I want maximum growth',
    borderColor: 'red',
  },
];

export default function StepRisk({ onNext }) {
  const { answers, setAnswer } = useInvestor();

  const handleSelect = (value) => {
    setAnswer('risk', value);
    // Auto-advance after a brief delay for visual feedback
    setTimeout(() => onNext(), 350);
  };

  return (
    <div className="animate-fade-in">
      {/* Question */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your comfort level</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          How do you feel about risk?
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          There's no wrong answer — just pick what feels right.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {RISK_OPTIONS.map((option, i) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            subtitle={option.subtitle}
            borderColor={option.borderColor}
            isSelected={answers.risk === option.value}
            onClick={() => handleSelect(option.value)}
            delay={i * 100}
          />
        ))}
      </div>
    </div>
  );
}
