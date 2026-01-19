import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { AddAlertForm } from '@/components/dialog/AddAlertForm';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Plus, Bell, Trash2, Edit2 } from 'lucide-react';
import { Alert } from '@/types/financial';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function AlertsPage() {
  const { alerts, deleteAlert } = useFinancialData();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const handleEdit = (alert: Alert) => {
    setSelectedAlert(alert);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAlert) {
      deleteAlert(selectedAlert.id);
      toast.success('Alert deleted');
      setDeleteDialogOpen(false);
      setSelectedAlert(null);
    }
  };

  const highPriorityAlerts = alerts.filter(a => a.priority === 'high');
  const mediumPriorityAlerts = alerts.filter(a => a.priority === 'medium');
  const lowPriorityAlerts = alerts.filter(a => a.priority === 'low');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Alerts & Reminders</h1>
          <p className="text-muted-foreground mt-1">Stay on top of important dates and actions</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>Set up a reminder for an important date or action</DialogDescription>
            </DialogHeader>
            <AddAlertForm onSuccess={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-destructive">{highPriorityAlerts.length}</p>
          <p className="text-sm text-muted-foreground">High Priority</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{mediumPriorityAlerts.length}</p>
          <p className="text-sm text-muted-foreground">Medium Priority</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{lowPriorityAlerts.length}</p>
          <p className="text-sm text-muted-foreground">Low Priority</p>
        </div>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No alerts yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first alert to stay on top of important dates
          </p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="relative group">
              <AlertCard alert={alert} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-background/80 backdrop-blur"
                  onClick={() => handleEdit(alert)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-background/80 backdrop-blur text-destructive hover:text-destructive"
                  onClick={() => handleDeleteClick(alert)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alert</DialogTitle>
            <DialogDescription>Update the alert details</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <AddAlertForm
              editAlert={selectedAlert}
              onSuccess={() => {
                setEditDialogOpen(false);
                setSelectedAlert(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedAlert?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
