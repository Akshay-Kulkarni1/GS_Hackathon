import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 1700);
    const finishTimer = setTimeout(() => onFinish(), 2200);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-gradient-to-br from-white via-white to-emerald-50/40
        ${exiting ? 'splash-exit' : ''}
      `}
    >
      {/* Shield icon */}
      <div className="splash-logo mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-200/50">
          <Shield className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
      </div>

      {/* App name */}
      <h1 className="splash-text text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
        Clear<span className="text-brand-600">Vest</span>
      </h1>

      {/* Tagline */}
      <p className="splash-tagline text-base sm:text-lg text-gray-400 font-medium mt-3">
        Your money, made simple
      </p>
    </div>
  );
}
