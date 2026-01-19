import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp } from 'lucide-react';
import { AddPolicyForm } from './AddPolicyForm';
import { AddInvestmentForm } from './AddInvestmentForm';

interface AddNewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'select' | 'policy' | 'investment';

export function AddNewDialog({ open, onOpenChange }: AddNewDialogProps) {
  const [step, setStep] = useState<Step>('select');

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep('select'), 200);
  };

  const handleSuccess = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === 'select' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-display">Add New</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={() => setStep('policy')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all group"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">Insurance Policy</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Life, vehicle, home, health
                  </p>
                </div>
              </button>
              <button
                onClick={() => setStep('investment')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all group"
              >
                <div className="p-3 rounded-lg bg-success/10 text-success group-hover:bg-success/20 transition-colors">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">Investment</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Retirement, savings, stocks
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {step === 'policy' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-display flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setStep('select')} className="mr-2">
                  ←
                </Button>
                Add Insurance Policy
              </DialogTitle>
            </DialogHeader>
            <AddPolicyForm onSuccess={handleSuccess} onCancel={() => setStep('select')} />
          </>
        )}

        {step === 'investment' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-display flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setStep('select')} className="mr-2">
                  ←
                </Button>
                Add Investment
              </DialogTitle>
            </DialogHeader>
            <AddInvestmentForm onSuccess={handleSuccess} onCancel={() => setStep('select')} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
