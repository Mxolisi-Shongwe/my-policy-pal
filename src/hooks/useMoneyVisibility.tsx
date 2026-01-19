import { createContext, useContext, useState, ReactNode } from 'react';

interface MoneyVisibilityContextType {
  isVisible: boolean;
  toggle: () => void;
}

const MoneyVisibilityContext = createContext<MoneyVisibilityContextType | undefined>(undefined);

export function MoneyVisibilityProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => setIsVisible((prev) => !prev);

  return (
    <MoneyVisibilityContext.Provider value={{ isVisible, toggle }}>
      {children}
    </MoneyVisibilityContext.Provider>
  );
}

export function useMoneyVisibility() {
  const context = useContext(MoneyVisibilityContext);
  if (!context) {
    throw new Error('useMoneyVisibility must be used within a MoneyVisibilityProvider');
  }
  return context;
}

export function formatCurrency(amount: number, isVisible: boolean) {
  if (!isVisible) {
    return '••••••';
  }
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount);
}
