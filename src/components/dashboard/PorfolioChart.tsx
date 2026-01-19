import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Investment } from '@/types/financial';
import { useMoneyVisibility, formatCurrency } from '@/hooks/useMoneyVisibility';

interface PortfolioChartProps {
  investments: Investment[];
}

const COLORS = ['#E5A530', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];

export function PortfolioChart({ investments }: PortfolioChartProps) {
  const { isVisible } = useMoneyVisibility();

  const data = investments.map((inv, index) => ({
    name: inv.name,
    value: inv.currentValue,
    color: COLORS[index % COLORS.length],
  }));

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-primary font-semibold">{formatCurrency(data.value, isVisible)}</p>
          <p className="text-muted-foreground text-sm">{percentage}% of portfolio</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-xl font-semibold mb-2">Portfolio Allocation</h3>
      <p className="text-muted-foreground text-sm mb-4">Total: {formatCurrency(totalValue, isVisible)}</p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground truncate max-w-[120px]">{item.name}</span>
            </div>
            <span className="font-medium text-foreground">
              {((item.value / totalValue) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
