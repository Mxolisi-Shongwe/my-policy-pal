import { Investment, InvestmentType } from '@/types/financial';
import { TrendingUp, TrendingDown, Minus, PiggyBank, LineChart, BarChart3, Wallet } from 'lucide-react';
import { useMoneyVisibility, formatCurrency } from '@/hooks/useMoneyVisibility';

const investmentIcons: Record<InvestmentType, React.ReactNode> = {
  retirement: <PiggyBank className="w-5 h-5" />,
  'unit-trust': <LineChart className="w-5 h-5" />,
  stocks: <BarChart3 className="w-5 h-5" />,
  savings: <Wallet className="w-5 h-5" />,
  other: <LineChart className="w-5 h-5" />,
};

interface InvestmentCardProps {
  investment: Investment;
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
  const { isVisible } = useMoneyVisibility();

  const profit = investment.currentValue - investment.totalContributions;
  const isPositive = profit >= 0;

  return (
    <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg transition-colors ${
            investment.status === 'growing' ? 'bg-success/10 text-success' :
            investment.status === 'declining' ? 'bg-destructive/10 text-destructive' :
            'bg-primary/10 text-primary'
          } group-hover:opacity-90`}>
            {investmentIcons[investment.type]}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{investment.name}</h4>
            <p className="text-sm text-muted-foreground">{investment.provider}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-success' : 'text-destructive'
        }`}>
          {investment.status === 'growing' && <TrendingUp className="w-4 h-4" />}
          {investment.status === 'declining' && <TrendingDown className="w-4 h-4" />}
          {investment.status === 'stable' && <Minus className="w-4 h-4" />}
          {isVisible ? `${investment.returnPercentage > 0 ? '+' : ''}${investment.returnPercentage}%` : '•••'}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-muted-foreground text-sm">Current Value</p>
        <p className="text-2xl font-bold font-display gold-text">
          {formatCurrency(investment.currentValue, isVisible)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Contributed</p>
          <p className="font-medium text-foreground">{formatCurrency(investment.totalContributions, isVisible)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Profit/Loss</p>
          <p className={`font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isVisible ? `${isPositive ? '+' : ''}${formatCurrency(profit, true).replace('R', 'R ')}` : '••••••'}
          </p>
        </div>
        {investment.monthlyContribution && (
          <>
            <div className="col-span-2 pt-2 border-t border-border">
              <p className="text-muted-foreground">Monthly Contribution</p>
              <p className="font-medium text-foreground">{formatCurrency(investment.monthlyContribution, isVisible)}</p>
            </div>
          </>
        )}
      </div>

      {investment.notes && (
        <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
          {investment.notes}
        </p>
      )}
    </div>
  );
}
