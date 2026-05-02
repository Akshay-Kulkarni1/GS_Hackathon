import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import StepRisk from '../steps/StepRisk';
import StepGoal from '../steps/StepGoal';
import StepTimeline from '../steps/StepTimeline';
import ResultScreen from '../steps/ResultScreen';
import { useInvestor } from '../context/InvestorContext';

const TOTAL_STEPS = 3;

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward'); // 'forward' | 'back'
  const { answers } = useInvestor();

  const showResult = step > TOTAL_STEPS;

  const handleNext = () => {
    setDirection('forward');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setDirection('back');
    setStep(prev => Math.max(1, prev - 1));
  };

  // Use step as key to force re-mount and trigger animation on each step change
  const animationClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-fade-in';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-50 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Clear<span className="text-brand-600">Vest</span>
            </span>
          </div>

          {/* Back button (hidden on step 1 and result) */}
          {step > 1 && !showResult && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress bar (hidden on result) */}
          {!showResult && (
            <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
          )}

          {/* Steps — keyed for transition animation */}
          <div key={step} className={animationClass}>
            {step === 1 && <StepRisk onNext={handleNext} />}
            {step === 2 && <StepGoal onNext={handleNext} />}
            {step === 3 && <StepTimeline onNext={handleNext} />}
            {showResult && <ResultScreen />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-50 py-4">
        <p className="text-center text-xs text-gray-300">
          ClearVest · Your money, made simple
        </p>
      </footer>
    </div>
  );
}
