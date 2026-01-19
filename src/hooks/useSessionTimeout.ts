import { useEffect, useState, useCallback } from 'react';
import { auth } from '@/integrations/firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const WARNING_TIME = 60 * 1000; // 1 minute before timeout

export function useSessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();
  
  const logout = useCallback(async () => {
    await signOut(auth);
    navigate('/auth');
  }, [navigate]);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setTimeLeft(60);
  }, []);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const startTimers = () => {
      // Clear existing timers
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);

      // Set warning timer (4 minutes)
      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(60);
        
        // Start countdown
        countdownInterval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              logout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, INACTIVITY_TIMEOUT - WARNING_TIME);

      // Set logout timer (5 minutes)
      inactivityTimer = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    const handleActivity = () => {
      if (!showWarning) {
        startTimers();
      }
    };

    // Activity events to monitor
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Start initial timers
    startTimers();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [showWarning, logout]);

  const keepAlive = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return { showWarning, timeLeft, keepAlive, logout };
}
