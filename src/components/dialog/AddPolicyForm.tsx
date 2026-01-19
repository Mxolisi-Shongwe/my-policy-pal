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
import { PolicyType } from '@/types/financial';

const policySchema = z.object({
  name: z.string().min(1, 'Policy name is required').max(100),
  type: z.enum(['life', 'vehicle', 'home', 'health', 'bond', 'other'] as const),
  provider: z.string().min(1, 'Provider is required').max(100),
  policyNumber: z.string().min(1, 'Policy number is required').max(50),
  startDate: z.string().min(1, 'Start date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  premium: z.coerce.number().min(0, 'Premium must be positive'),
  premiumFrequency: z.enum(['monthly', 'annual', 'once-off'] as const),
  coverage: z.coerce.number().min(0, 'Coverage must be positive'),
  notes: z.string().max(500).optional().or(z.literal('')),
});

type PolicyFormData = z.infer<typeof policySchema>;

interface AddPolicyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const policyTypes: { value: PolicyType; label: string }[] = [
  { value: 'life', label: 'Life Insurance' },
  { value: 'vehicle', label: 'Vehicle Insurance' },
  { value: 'home', label: 'Home Insurance' },
  { value: 'health', label: 'Health/Medical' },
  { value: 'bond', label: 'Bond Insurance' },
  { value: 'other', label: 'Other' },
];

export function AddPolicyForm({ onSuccess, onCancel }: AddPolicyFormProps) {
  const { addPolicy } = useFinancialData();
  const { toast } = useToast();

  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: '',
      type: 'life',
      provider: '',
      policyNumber: '',
      startDate: '',
      expiryDate: '',
      premium: 0,
      premiumFrequency: 'monthly',
      coverage: 0,
      notes: '',
    },
  });

  const onSubmit = async (data: PolicyFormData) => {
    try {
      const expiryDate = new Date(data.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let status: 'active' | 'expiring-soon' | 'expired' = 'active';
      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring-soon';
      }

      await addPolicy({
        name: data.name,
        type: data.type,
        provider: data.provider,
        policyNumber: data.policyNumber,
        startDate: data.startDate,
        expiryDate: data.expiryDate,
        premium: data.premium,
        premiumFrequency: data.premiumFrequency,
        coverage: data.coverage,
        status,
        notes: data.notes || undefined,
      });

      toast({
        title: 'Policy added',
        description: `${data.name} has been added successfully.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add policy',
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
                <FormLabel>Policy Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Life Cover Plus" {...field} />
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
                    {policyTypes.map((type) => (
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
                  <Input placeholder="e.g. Old Mutual" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="policyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. OM-LC-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="premiumFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premium Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="once-off">Once-off</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="premium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premium (R)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coverage Amount (R)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
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
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
            Add Policy
          </Button>
        </div>
      </form>
    </Form>
  );
}
