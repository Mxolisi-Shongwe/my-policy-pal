import { TrendingUp, TrendingDown, FileText, Calendar } from 'lucide-react';
import { formatCurrency } from '@/hooks/useMoneyVisibility';
import type { Policy, Investment } from '@/types/financial';

interface QuickStatsProps {
  policies: Policy[];
  investments: Investment[];
  isVisible: boolean;
  documentsCount: number;
}

export function QuickStats({ policies, investments, isVisible, documentsCount }: QuickStatsProps) {
  const expiringPolicies = policies.filter(p => {
    const daysUntilExpiry = Math.floor(
      (new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
  }).length;

  const totalMonthlyPremiums = policies
    .filter(p => p.premiumFrequency === 'monthly')
    .reduce((sum, p) => sum + p.premium, 0);

  const totalAnnualPremiums = policies
    .filter(p => p.premiumFrequency === 'annual')
    .reduce((sum, p) => sum + p.premium, 0);

  const avgInvestmentReturn = investments.length > 0
    ? investments.reduce((sum, i) => sum + i.returnPercentage, 0) / investments.length
    : 0;

  const positiveReturns = investments.filter(i => i.returnPercentage > 0).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-warning mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-xs font-medium">Expiring Soon</span>
        </div>
        <p className="text-2xl font-bold">{expiringPolicies}</p>
        <p className="text-xs text-muted-foreground">Within 60 days</p>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-primary mb-2">
          <FileText className="w-4 h-4" />
          <span className="text-xs font-medium">Total Documents</span>
        </div>
        <p className="text-2xl font-bold">{documentsCount}</p>
        <p className="text-xs text-muted-foreground">Stored files</p>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-success mb-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Avg Return</span>
        </div>
        <p className="text-2xl font-bold">{avgInvestmentReturn.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">{positiveReturns} positive</p>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <TrendingDown className="w-4 h-4" />
          <span className="text-xs font-medium">At Risk</span>
        </div>
        <p className="text-2xl font-bold">{investments.filter(i => i.status === 'declining').length}</p>
        <p className="text-xs text-muted-foreground">Declining investments</p>
      </div>
    </div>
  );
}
