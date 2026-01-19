export type PolicyType = 'life' | 'vehicle' | 'home' | 'health' | 'bond' | 'other';
export type InvestmentType = 'retirement' | 'unit-trust' | 'stocks' | 'savings' | 'other';

export interface Policy {
  id: string;
  name: string;
  type: PolicyType;
  provider: string;
  policyNumber: string;
  startDate: string;
  expiryDate: string;
  premium: number;
  premiumFrequency: 'monthly' | 'annual' | 'once-off';
  coverage: number;
  status: 'active' | 'expiring-soon' | 'expired';
  notes?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  provider: string;
  accountNumber?: string;
  startDate: string;
  currentValue: number;
  totalContributions: number;
  monthlyContribution?: number;
  returnPercentage: number;
  status: 'growing' | 'stable' | 'declining';
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'renewal' | 'payment' | 'expiry' | 'review' | 'opportunity';
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  relatedItemId?: string;
  relatedItemType?: 'policy' | 'investment';
}
