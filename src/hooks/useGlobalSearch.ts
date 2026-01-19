import { useMemo } from 'react';
import type { Policy, Investment, Alert } from '@/types/financial';

export function useGlobalSearch(
  searchQuery: string,
  policies: Policy[],
  investments: Investment[],
  alerts: Alert[]
) {
  return useMemo(() => {
    if (!searchQuery.trim()) {
      return { policies, investments, alerts };
    }

    const query = searchQuery.toLowerCase();

    const filteredPolicies = policies.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.provider.toLowerCase().includes(query) ||
      p.policyNumber.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query)
    );

    const filteredInvestments = investments.filter(i =>
      i.name.toLowerCase().includes(query) ||
      i.provider.toLowerCase().includes(query) ||
      i.type.toLowerCase().includes(query)
    );

    const filteredAlerts = alerts.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    );

    return {
      policies: filteredPolicies,
      investments: filteredInvestments,
      alerts: filteredAlerts
    };
  }, [searchQuery, policies, investments, alerts]);
}
