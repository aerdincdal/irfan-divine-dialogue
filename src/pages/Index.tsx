import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Onboarding } from "@/components/Onboarding";
import { AuthScreen } from "@/components/AuthScreen";
import Chat from "./Chat";

type AppState = 'splash' | 'onboarding' | 'auth' | 'chat';

export default function Index() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem('irfan_onboarding_complete');
    const isAuthenticated = localStorage.getItem('irfan_user_authenticated');
    
    if (hasCompletedOnboarding && isAuthenticated) {
      setIsFirstTime(false);
    }
  }, []);

  const handleSplashComplete = () => {
    if (isFirstTime) {
      setAppState('onboarding');
    } else {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('irfan_user_authenticated');
      if (isAuthenticated) {
        setAppState('chat');
      } else {
        setAppState('auth');
      }
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('irfan_onboarding_complete', 'true');
    setAppState('auth');
  };

  const handleAuthSuccess = () => {
    localStorage.setItem('irfan_user_authenticated', 'true');
    setAppState('chat');
  };

  switch (appState) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    
    case 'onboarding':
      return <Onboarding onComplete={handleOnboardingComplete} />;
    
    case 'auth':
      return <AuthScreen onSuccess={handleAuthSuccess} />;
    
    case 'chat':
      return <Chat />;
    
    default:
      return <SplashScreen onComplete={handleSplashComplete} />;
  }
}