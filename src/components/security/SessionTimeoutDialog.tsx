import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SessionTimeoutDialogProps {
  open: boolean;
  timeLeft: number;
  onKeepAlive: () => void;
  onLogout: () => void;
}

export function SessionTimeoutDialog({ open, timeLeft, onKeepAlive, onLogout }: SessionTimeoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-warning/10">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <DialogTitle>Session Expiring Soon</DialogTitle>
              <DialogDescription>
                Your session will expire due to inactivity
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              You will be automatically logged out in:
            </p>
            <div className="text-4xl font-bold text-warning">
              {timeLeft}s
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click "Stay Logged In" to continue your session
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onLogout} className="w-full sm:w-auto">
            Log Out Now
          </Button>
          <Button onClick={onKeepAlive} className="w-full sm:w-auto">
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
