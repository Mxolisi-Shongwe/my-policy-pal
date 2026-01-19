import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const steps: TutorialStep[] = [
  {
    target: '[data-tutorial="add-new"]',
    title: 'Add New',
    description: 'Add new policies, investments, or alerts.',
    position: 'right'
  },
  {
    target: '[data-tutorial="dashboard"]',
    title: 'Dashboard',
    description: 'View your financial overview and quick stats.',
    position: 'right'
  },
  {
    target: '[data-tutorial="policies"]',
    title: 'Policies',
    description: 'Manage all your insurance policies.',
    position: 'right'
  },
  {
    target: '[data-tutorial="investments"]',
    title: 'Investments',
    description: 'Track your investment portfolio.',
    position: 'right'
  },
  {
    target: '[data-tutorial="alerts"]',
    title: 'Alerts',
    description: 'View and manage important reminders.',
    position: 'right'
  },
  {
    target: '[data-tutorial="documents"]',
    title: 'Documents',
    description: 'Store and organize your financial documents.',
    position: 'right'
  },
  {
    target: '[data-tutorial="search"]',
    title: 'Search',
    description: 'Quickly find policies, investments, and alerts by typing here.',
    position: 'bottom'
  },
  {
    target: '[data-tutorial="theme"]',
    title: 'Theme Toggle',
    description: 'Switch between dark and light mode.',
    position: 'bottom'
  },
  {
    target: '[data-tutorial="visibility"]',
    title: 'Money Visibility',
    description: 'Hide or show financial amounts for privacy.',
    position: 'bottom'
  },
  {
    target: '[data-tutorial="notifications"]',
    title: 'Notifications',
    description: 'View important alerts and reminders.',
    position: 'bottom'
  },
  {
    target: '[data-tutorial="logout"]',
    title: 'Sign Out',
    description: 'Sign out of your account.',
    position: 'bottom'
  },
  {
    target: '[data-tutorial="profile"]',
    title: 'Profile',
    description: 'Manage your personal information and account settings.',
    position: 'bottom'
  }
];

export function Tutorial({ forceStart, onComplete }: { forceStart?: boolean; onComplete?: () => void }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (forceStart) {
      setIsActive(true);
      setCurrentStep(0);
    }
  }, [forceStart]);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial && !forceStart) {
      setTimeout(() => setIsActive(true), 1000);
    }
  }, [forceStart]);

  useEffect(() => {
    if (isActive && currentStep < steps.length) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        const rect = element.getBoundingClientRect();
        const step = steps[currentStep];
        
        // Add highlight class
        element.classList.add('tutorial-highlight');
        
        let top = rect.top;
        let left = rect.left;
        const cardWidth = 320; // 80 * 4 (w-80)
        const cardHeight = 200; // approximate height
        const padding = 16;
        const headerHeight = 64; // h-16 = 64px

        if (step.position === 'bottom') {
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2;
          // Keep within viewport horizontally
          if (left + cardWidth / 2 > window.innerWidth - padding) {
            left = window.innerWidth - cardWidth - padding;
          } else if (left - cardWidth / 2 < padding) {
            left = padding;
          } else {
            left = left - cardWidth / 2;
          }
          // Keep within viewport vertically
          if (top + cardHeight > window.innerHeight - padding) {
            top = rect.top - cardHeight - 10;
          }
        } else if (step.position === 'right') {
          top = rect.top + rect.height / 2 - 100;
          left = rect.right + 10;
          // If too far right, show on left instead
          if (left + cardWidth > window.innerWidth - padding) {
            left = rect.left - cardWidth - 10;
          }
          // Keep below header
          if (top < headerHeight + padding) {
            top = headerHeight + padding;
          } else if (top + cardHeight > window.innerHeight - padding) {
            top = window.innerHeight - cardHeight - padding;
          }
        }

        setPosition({ top, left });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight from previous element
        return () => {
          element.classList.remove('tutorial-highlight');
        };
      }
    }
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsActive(false);
    localStorage.setItem('hasSeenTutorial', 'true');
    onComplete?.();
  };

  if (!isActive) return null;

  const step = steps[currentStep];

  return (
    <>
      <style>{`
        .tutorial-highlight {
          position: relative;
          z-index: 45 !important;
          box-shadow: 0 0 0 4px hsl(var(--primary)) !important;
          border-radius: 0.5rem;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px hsl(var(--primary));
          }
          50% {
            box-shadow: 0 0 0 8px hsl(var(--primary) / 0.5);
          }
        }
      `}</style>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={handleClose} />
      <Card 
        className="fixed z-50 w-80 shadow-xl"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Skip
              </Button>
              <Button size="sm" onClick={handleNext}>
                {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
