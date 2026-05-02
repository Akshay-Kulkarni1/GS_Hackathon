import { useState, useCallback } from 'react';
import { InvestorProvider, useInvestor } from './context/InvestorContext';
import SplashScreen from './components/SplashScreen';
import OnboardingWizard from './screens/OnboardingWizard';
import PortfolioScreen from './screens/PortfolioScreen';
import WhatIfScreen from './screens/WhatIfScreen';
import PlanScreen from './screens/PlanScreen';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { currentScreen } = useInvestor();

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div key={currentScreen} className="screen-enter">
      {currentScreen === 'onboarding' && <OnboardingWizard />}
      {currentScreen === 'portfolio' && <PortfolioScreen />}
      {currentScreen === 'whatif' && <WhatIfScreen />}
      {currentScreen === 'plan' && <PlanScreen />}
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
