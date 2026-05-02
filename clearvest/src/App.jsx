import { useState, useCallback, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { InvestorProvider, useInvestor } from './context/InvestorContext';
import SplashScreen from './components/SplashScreen';
import OnboardingWizard from './screens/OnboardingWizard';
import PortfolioScreen from './screens/PortfolioScreen';
import WhatIfScreen from './screens/WhatIfScreen';
import PlanScreen from './screens/PlanScreen';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [visibleScreen, setVisibleScreen] = useState('onboarding');
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const { currentScreen } = useInvestor();

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    if (showSplash) return undefined;
    if (currentScreen === visibleScreen) return undefined;

    setIsScreenLoading(true);
    const timer = setTimeout(() => {
      setVisibleScreen(currentScreen);
      setIsScreenLoading(false);
    }, 260);

    return () => clearTimeout(timer);
  }, [currentScreen, showSplash, visibleScreen]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isScreenLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-flex items-center gap-3 text-gray-500">
          <Loader className="w-5 h-5 animate-spin text-brand-600" />
          <span className="text-sm font-semibold">Loading your screen...</span>
        </div>
      </div>
    );
  }

  return (
    <div key={visibleScreen} className="screen-enter">
      {visibleScreen === 'onboarding' && <OnboardingWizard />}
      {visibleScreen === 'portfolio' && <PortfolioScreen />}
      {visibleScreen === 'whatif' && <WhatIfScreen />}
      {visibleScreen === 'plan' && <PlanScreen />}
    </div>
  );
}

export default function App() {
  return (
    <InvestorProvider>
      <AppContent />
    </InvestorProvider>
  );
}
