export default function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-10">
      {/* Step indicator text */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500 tracking-wide">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-brand-600">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Track */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full progress-shimmer rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i + 1 <= currentStep
                ? 'bg-brand-600 scale-110'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
