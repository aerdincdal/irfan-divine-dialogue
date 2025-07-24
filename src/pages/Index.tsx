import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Onboarding } from "@/components/Onboarding";
import { AuthScreen } from "@/components/AuthScreen";
import Chat from "./Chat";
import { useAuth } from "@/hooks/useAuth";

type AppState = 'splash' | 'onboarding' | 'auth' | 'chat';

export default function Index() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [isFirstTime, setIsFirstTime] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem('irfan_onboarding_complete');
    
    if (hasCompletedOnboarding) {
      setIsFirstTime(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && appState === 'auth') {
        setAppState('chat');
      } else if (!user && appState === 'chat') {
        setAppState('auth');
      }
    }
  }, [user, loading, appState]);

  const handleSplashComplete = () => {
    if (isFirstTime) {
      setAppState('onboarding');
    } else {
      if (user) {
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
    setAppState('chat');
  };

  if (loading) {
    return <SplashScreen onComplete={() => {}} />;
  }

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