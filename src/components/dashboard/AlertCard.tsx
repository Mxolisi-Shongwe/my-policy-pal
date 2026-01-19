import { Alert } from '@/types/financial';
import { AlertCircle, Clock, Calendar, TrendingUp, Bell } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const alertIcons: Record<Alert['type'], React.ReactNode> = {
  renewal: <Clock className="w-4 h-4" />,
  payment: <Calendar className="w-4 h-4" />,
  expiry: <AlertCircle className="w-4 h-4" />,
  review: <TrendingUp className="w-4 h-4" />,
  opportunity: <Bell className="w-4 h-4" />,
};

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const daysUntilDue = differenceInDays(new Date(alert.dueDate), new Date());
  const isUrgent = daysUntilDue <= 7;
  const isOverdue = daysUntilDue < 0;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 hover:border-primary/30 ${
      alert.priority === 'high' ? 'bg-destructive/5 border-destructive/20' :
      alert.priority === 'medium' ? 'bg-warning/5 border-warning/20' :
      'bg-card/50 border-border'
    }`}>
      <div className={`p-2 rounded-lg ${
        alert.priority === 'high' ? 'bg-destructive/10 text-destructive' :
        alert.priority === 'medium' ? 'bg-warning/10 text-warning' :
        'bg-primary/10 text-primary'
      }`}>
        {alertIcons[alert.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-foreground text-sm">{alert.title}</h4>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isOverdue ? 'bg-destructive/20 text-destructive' :
            isUrgent ? 'bg-warning/20 text-warning' :
            'bg-muted text-muted-foreground'
          }`}>
            {isOverdue ? 'Overdue' : isUrgent ? 'Urgent' : format(new Date(alert.dueDate), 'dd MMM')}
          </span>
        </div>
        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
          {alert.description}
        </p>
      </div>
    </div>
  );
}
