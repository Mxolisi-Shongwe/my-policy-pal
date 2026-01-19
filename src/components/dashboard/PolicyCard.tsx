import { Policy, PolicyType } from '@/types/financial';
import { Shield, Car, Home, Heart, FileText, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { useMoneyVisibility, formatCurrency } from '@/hooks/useMoneyVisibility';

const policyIcons: Record<PolicyType, React.ReactNode> = {
  life: <Shield className="w-5 h-5" />,
  vehicle: <Car className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  health: <Heart className="w-5 h-5" />,
  bond: <Building className="w-5 h-5" />,
  other: <FileText className="w-5 h-5" />,
};

interface PolicyCardProps {
  policy: Policy;
}

export function PolicyCard({ policy }: PolicyCardProps) {
  const { isVisible } = useMoneyVisibility();
  const daysUntilExpiry = differenceInDays(new Date(policy.expiryDate), new Date());
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry < 0;

  return (
    <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {policyIcons[policy.type]}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{policy.name}</h4>
            <p className="text-sm text-muted-foreground">{policy.provider}</p>
          </div>
        </div>
        <Badge 
          variant={isExpired ? 'destructive' : isExpiringSoon ? 'outline' : 'secondary'}
          className={isExpiringSoon ? 'border-warning text-warning' : ''}
        >
          {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Premium</p>
          <p className="font-medium text-foreground">
            {formatCurrency(policy.premium, isVisible)}/{policy.premiumFrequency === 'monthly' ? 'mo' : 'yr'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Coverage</p>
          <p className="font-medium text-foreground">
            {policy.coverage > 0 ? formatCurrency(policy.coverage, isVisible) : 'Unlimited'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Policy #</p>
          <p className="font-medium text-foreground text-xs">{policy.policyNumber}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Expires</p>
          <p className={`font-medium ${isExpiringSoon ? 'text-warning' : isExpired ? 'text-destructive' : 'text-foreground'}`}>
            {format(new Date(policy.expiryDate), 'dd MMM yyyy')}
          </p>
        </div>
      </div>

      {policy.notes && (
        <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
          {policy.notes}
        </p>
      )}
    </div>
  );
}
