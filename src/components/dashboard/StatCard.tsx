import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMoneyVisibility } from '@/hooks/useMoneyVisibility';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: ReactNode;
  isCurrency?: boolean;
}

export function StatCard({ title, value, subtitle, trend, trendValue, icon, isCurrency = false }: StatCardProps) {
  const { isVisible } = useMoneyVisibility();
  
  const displayValue = isCurrency && !isVisible ? '••••••' : value;
  const displayTrend = isCurrency && !isVisible ? '•••' : trendValue;

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-success' : 
            trend === 'down' ? 'text-destructive' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend === 'neutral' && <Minus className="w-4 h-4" />}
            {displayTrend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold font-display gold-text">{displayValue}</h3>
        <p className="text-muted-foreground text-sm mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
