import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useToast } from '@/hooks/use-toast';
import { InvestmentType } from '@/types/financial';

const investmentSchema = z.object({
  name: z.string().min(1, 'Investment name is required').max(100),
  type: z.enum(['retirement', 'unit-trust', 'stocks', 'savings', 'other'] as const),
  provider: z.string().min(1, 'Provider is required').max(100),
  accountNumber: z.string().max(50).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  currentValue: z.coerce.number().min(0, 'Current value must be positive'),
  totalContributions: z.coerce.number().min(0, 'Contributions must be positive'),
  monthlyContribution: z.coerce.number().min(0).optional().or(z.literal('')),
  returnPercentage: z.coerce.number(),
  notes: z.string().max(500).optional().or(z.literal('')),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface AddInvestmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const investmentTypes: { value: InvestmentType; label: string }[] = [
  { value: 'retirement', label: 'Retirement Annuity' },
  { value: 'unit-trust', label: 'Unit Trust' },
  { value: 'stocks', label: 'Stocks/Equity' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'other', label: 'Other' },
];

export function AddInvestmentForm({ onSuccess, onCancel }: AddInvestmentFormProps) {
  const { addInvestment } = useFinancialData();
  const { toast } = useToast();

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: '',
      type: 'savings',
      provider: '',
      accountNumber: '',
      startDate: '',
      currentValue: 0,
      totalContributions: 0,
      monthlyContribution: 0,
      returnPercentage: 0,
      notes: '',
    },
  });

  const onSubmit = async (data: InvestmentFormData) => {
    try {
      const profit = data.currentValue - data.totalContributions;
      let status: 'growing' | 'stable' | 'declining' = 'stable';
      if (data.returnPercentage > 2) {
        status = 'growing';
      } else if (data.returnPercentage < -2) {
        status = 'declining';
      }

      await addInvestment({
        name: data.name,
        type: data.type,
        provider: data.provider,
        startDate: data.startDate,
        currentValue: data.currentValue,
        totalContributions: data.totalContributions,
        returnPercentage: data.returnPercentage,
        status,
        accountNumber: data.accountNumber || undefined,
        monthlyContribution: data.monthlyContribution || undefined,
        notes: data.notes || undefined,
      });

      toast({
        title: 'Investment added',
        description: `${data.name} has been added successfully.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add investment',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Investment Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Retirement Annuity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    {investmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Allan Gray" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. AG-RA-78945" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Value (R)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalContributions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Contributions (R)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Contribution (R)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Percentage (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional notes..." 
                    className="resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="gold">
            Add Investment
          </Button>
        </div>
      </form>
    </Form>
  );
}
