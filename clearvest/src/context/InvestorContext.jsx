import { createContext, useContext, useState } from 'react';

const InvestorContext = createContext(null);

// Profile mapping: risk + goal + timeline → profile name + description
const PROFILES = {
  // Safe combinations
  'safe-home-short':       { name: 'Cautious Planner',     desc: 'You like to keep things safe while saving up for life\'s big milestones.' },
  'safe-home-medium':      { name: 'Steady Saver',         desc: 'You\'re building toward a home with a patient, low-risk approach.' },
  'safe-home-long':        { name: 'Patient Protector',    desc: 'You\'re playing the long game toward homeownership, keeping every dollar safe.' },
  'safe-retire-short':     { name: 'Security Seeker',      desc: 'You want your retirement savings locked down tight, no surprises.' },
  'safe-retire-medium':    { name: 'Careful Cruiser',      desc: 'You\'re on a smooth, steady path to a worry-free retirement.' },
  'safe-retire-long':      { name: 'Peaceful Planner',     desc: 'You\'ve got time and prefer a calm, protected journey to retirement.' },
  'safe-growth-short':     { name: 'Cautious Grower',      desc: 'You want to grow your money, but only if it feels safe.' },
  'safe-growth-medium':    { name: 'Gentle Builder',       desc: 'You\'re building wealth slowly and steadily, no unnecessary risks.' },
  'safe-growth-long':      { name: 'Steady Climber',       desc: 'You\'re in it for the long haul, growing your wealth without the stress.' },
  'safe-emergency-short':  { name: 'Smart Saver',          desc: 'You want a solid safety net, ready for whatever life throws at you.' },
  'safe-emergency-medium': { name: 'Prepared Planner',     desc: 'You\'re building a strong emergency fund with zero drama.' },
  'safe-emergency-long':   { name: 'Fort Builder',         desc: 'You\'re creating an unshakeable financial safety net for the future.' },

  // Middle combinations
  'middle-home-short':     { name: 'Balanced Buyer',       desc: 'You\'re saving for a home while keeping a healthy mix of safety and growth.' },
  'middle-home-medium':    { name: 'Smart Homesteader',    desc: 'You\'re taking a balanced approach to reach your homeownership dream.' },
  'middle-home-long':      { name: 'Balanced Builder',     desc: 'You\'ve got time to grow your home fund with a sensible strategy.' },
  'middle-retire-short':   { name: 'Practical Planner',    desc: 'You want a balanced retirement plan that doesn\'t keep you up at night.' },
  'middle-retire-medium':  { name: 'Balanced Builder',     desc: 'You\'re building toward retirement with the right mix of growth and safety.' },
  'middle-retire-long':    { name: 'Thoughtful Voyager',   desc: 'You\'ve got decades ahead and a smart plan to make the most of them.' },
  'middle-growth-short':   { name: 'Savvy Starter',        desc: 'You want to grow your money with a measured, balanced approach.' },
  'middle-growth-medium':  { name: 'Growth Seeker',        desc: 'You\'re finding the sweet spot between growth and peace of mind.' },
  'middle-growth-long':    { name: 'Wise Investor',        desc: 'You\'re letting time and balance work together to build real wealth.' },
  'middle-emergency-short':{ name: 'Balanced Guardian',    desc: 'You\'re protecting your finances while still making your money work.' },
  'middle-emergency-medium':{ name: 'Smart Shield',        desc: 'You\'re building an emergency fund with a touch of growth on the side.' },
  'middle-emergency-long': { name: 'Resilient Planner',    desc: 'You\'re creating a flexible safety net that can grow over time.' },

  // Bold combinations
  'bold-home-short':       { name: 'Ambitious Buyer',      desc: 'You\'re going all-in to fast-track your way to homeownership.' },
  'bold-home-medium':      { name: 'Bold Homesteader',     desc: 'You\'re willing to take smart risks to get into your dream home faster.' },
  'bold-home-long':        { name: 'Adventurous Builder',  desc: 'You\'re leveraging time and boldness to build toward your dream home.' },
  'bold-retire-short':     { name: 'Power Planner',        desc: 'You want aggressive growth for your retirement—time is of the essence.' },
  'bold-retire-medium':    { name: 'Bold Dreamer',         desc: 'You\'re not afraid to swing big for a retirement that matches your ambitions.' },
  'bold-retire-long':      { name: 'Fearless Futurist',    desc: 'With decades ahead, you\'re going bold to maximize your retirement nest egg.' },
  'bold-growth-short':     { name: 'Momentum Chaser',      desc: 'You want fast growth and you\'re comfortable with the ride.' },
  'bold-growth-medium':    { name: 'Growth Warrior',        desc: 'You\'re a growth-first investor who thrives on opportunity.' },
  'bold-growth-long':      { name: 'Bold Explorer',        desc: 'You\'re all about maximum growth over the long run—bring on the adventure!' },
  'bold-emergency-short':  { name: 'Aggressive Saver',     desc: 'You want your emergency fund to grow fast, even if it takes a bumpy road.' },
  'bold-emergency-medium': { name: 'Bold Shield',          desc: 'You\'re building safety with an aggressive edge—why not grow while you save?' },
  'bold-emergency-long':   { name: 'Risk-Ready Guardian',  desc: 'You believe even your safety net should work hard and grow over time.' },
};

function getProfileKey(risk, goal, timeline) {
  return `${risk}-${goal}-${timeline}`;
}

function getProfile(risk, goal, timeline) {
  const key = getProfileKey(risk, goal, timeline);
  return PROFILES[key] || { name: 'Smart Investor', desc: 'You\'re ready to take control of your financial future.' };
}

// Map risk levels to portfolio allocation recommendations
function getPortfolioAllocation(risk, timeline) {
  const allocations = {
    'safe-short':   { stocks: 15, bonds: 60, savings: 20, alternatives: 5 },
    'safe-medium':  { stocks: 25, bonds: 55, savings: 15, alternatives: 5 },
    'safe-long':    { stocks: 40, bonds: 45, savings: 10, alternatives: 5 },
    'middle-short': { stocks: 30, bonds: 45, savings: 15, alternatives: 10 },
    'middle-medium':{ stocks: 50, bonds: 30, savings: 10, alternatives: 10 },
    'middle-long':  { stocks: 65, bonds: 20, savings: 5, alternatives: 10 },
    'bold-short':   { stocks: 55, bonds: 25, savings: 10, alternatives: 10 },
    'bold-medium':  { stocks: 70, bonds: 15, savings: 5, alternatives: 10 },
    'bold-long':    { stocks: 80, bonds: 8, savings: 2, alternatives: 10 },
  };
  const key = `${risk}-${timeline}`;
  return allocations[key] || { stocks: 50, bonds: 30, savings: 10, alternatives: 10 };
}

export function InvestorProvider({ children }) {
  const [answers, setAnswers] = useState({
    risk: null,     // 'safe' | 'middle' | 'bold'
    goal: null,     // 'home' | 'retire' | 'growth' | 'emergency'
    timeline: null, // 'short' | 'medium' | 'long'
  });
  const [currentScreen, setCurrentScreen] = useState('onboarding'); // 'onboarding' | 'portfolio' | 'whatif' | 'plan'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'whatif' | 'plan'

  const profile = answers.risk && answers.goal && answers.timeline
    ? getProfile(answers.risk, answers.goal, answers.timeline)
    : null;

  const allocation = answers.risk && answers.timeline
    ? getPortfolioAllocation(answers.risk, answers.timeline)
    : null;

  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const resetAnswers = () => {
    setAnswers({ risk: null, goal: null, timeline: null });
    setCurrentScreen('onboarding');
    setActiveTab('dashboard');
  };

  // Navigate to a tab (used by bottom nav)
  const navigateTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') setCurrentScreen('portfolio');
    else if (tab === 'whatif') setCurrentScreen('whatif');
    else if (tab === 'plan') setCurrentScreen('plan');
  };

  return (
    <InvestorContext.Provider value={{
      answers,
      setAnswer,
      resetAnswers,
      profile,
      allocation,
      currentScreen,
      setCurrentScreen,
      activeTab,
      setActiveTab,
      navigateTab,
    }}>
      {children}
    </InvestorContext.Provider>
  );
}

export function useInvestor() {
  const context = useContext(InvestorContext);
  if (!context) {
    throw new Error('useInvestor must be used within an InvestorProvider');
  }
  return context;
}
