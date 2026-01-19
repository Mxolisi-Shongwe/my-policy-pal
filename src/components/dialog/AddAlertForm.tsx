import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Alert } from '@/types/financial';
import { toast } from 'sonner';

const alertSchema = z.object({
  type: z.enum(['renewal', 'payment', 'expiry', 'review', 'opportunity']),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['high', 'medium', 'low']),
  relatedItemId: z.string().optional(),
  relatedItemType: z.enum(['policy', 'investment']).optional(),
});

type AlertFormData = z.infer<typeof alertSchema>;

interface AddAlertFormProps {
  onSuccess: () => void;
  editAlert?: Alert;
}

export function AddAlertForm({ onSuccess, editAlert }: AddAlertFormProps) {
  const { addAlert, updateAlert, policies, investments } = useFinancialData();

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: editAlert ? {
      type: editAlert.type,
      title: editAlert.title,
      description: editAlert.description,
      dueDate: editAlert.dueDate,
      priority: editAlert.priority,
      relatedItemId: editAlert.relatedItemId || '',
      relatedItemType: editAlert.relatedItemType,
    } : {
      type: 'reminder' as any,
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      relatedItemId: '',
      relatedItemType: undefined,
    },
  });

  const selectedRelatedType = form.watch('relatedItemType');

  const onSubmit = (data: AlertFormData) => {
    const alertData: Omit<Alert, 'id'> = {
      type: data.type,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      relatedItemId: data.relatedItemId || undefined,
      relatedItemType: data.relatedItemType || undefined,
    };

    if (editAlert) {
      updateAlert(editAlert.id, alertData);
      toast.success('Alert updated successfully');
    } else {
      addAlert(alertData);
      toast.success('Alert created successfully');
    }
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Policy Renewal Due" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="renewal">Renewal</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="expiry">Expiry</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="opportunity">Opportunity</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the alert details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="relatedItemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related To (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedRelatedType && (
            <FormField
              control={form.control}
              name="relatedItemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Item</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedRelatedType === 'policy' && policies.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                      {selectedRelatedType === 'investment' && investments.map((i) => (
                        <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" className="w-full">
          {editAlert ? 'Update Alert' : 'Create Alert'}
        </Button>
      </form>
    </Form>
  );
}
