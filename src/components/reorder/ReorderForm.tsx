'use client';

import type { SuggestReorderInput, SuggestReorderOutput, ReorderSuggestionItem } from '@/lib/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { handleReorderSuggestion } from '@/lib/actions';
import { Wand2 } from 'lucide-react';

const reorderFormSchema = z.object({
  salesData: z.string().min(1, 'Los datos de ventas son requeridos.'),
  currentStockLevels: z.string().min(1, 'Los niveles de stock actuales son requeridos.'),
  reorderThreshold: z.coerce.number().min(0, 'El umbral de reabastecimiento debe ser positivo.'),
});

type ReorderFormValues = z.infer<typeof reorderFormSchema>;

interface ReorderFormProps {
  onSuggestions: (suggestions: ReorderSuggestionItem[]) => void;
}

export function ReorderForm({ onSuggestions }: ReorderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReorderFormValues>({
    resolver: zodResolver(reorderFormSchema),
    defaultValues: {
      salesData: '',
      currentStockLevels: '',
      reorderThreshold: 10,
    },
  });

  const onSubmit: SubmitHandler<ReorderFormValues> = async (data) => {
    setIsLoading(true);
    onSuggestions([]); // Clear previous suggestions

    const result = await handleReorderSuggestion(data);
    
    if ('error' in result) {
      toast({ title: 'Error de IA', description: result.error, variant: 'destructive' });
      onSuggestions([]);
    } else if (result && result.itemsToReorder) {
      onSuggestions(result.itemsToReorder);
      if (result.itemsToReorder.length > 0) {
        toast({ title: 'Sugerencias Generadas', description: `Se encontraron ${result.itemsToReorder.length} sugerencias de reabastecimiento.` });
      } else {
         toast({ title: 'Sugerencias Generadas', description: 'No se encontraron artículos que necesiten reabastecimiento inmediato según los criterios.', variant: 'default' });
      }
    } else {
      toast({ title: 'Error Inesperado', description: 'La IA no devolvió un formato de respuesta válido.', variant: 'destructive' });
      onSuggestions([]);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="salesData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datos de Ventas (CSV)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: Tomates,100\nCebollas,80\nPollo,50"
                  className="min-h-[100px] font-code text-sm"
                  {...field}
                  aria-describedby="sales-data-description"
                />
              </FormControl>
              <p id="sales-data-description" className="text-xs text-muted-foreground mt-1">
                Introduce los datos de ventas en formato CSV: nombre_articulo,cantidad_vendida.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentStockLevels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveles de Stock Actuales (CSV)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: Tomates,20\nCebollas,15\nPollo,10"
                  className="min-h-[100px] font-code text-sm"
                  {...field}
                   aria-describedby="stock-data-description"
                />
              </FormControl>
               <p id="stock-data-description" className="text-xs text-muted-foreground mt-1">
                Introduce los niveles de stock en formato CSV: nombre_articulo,cantidad_en_stock.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reorderThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Umbral de Reabastecimiento</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ej: 10" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Cantidad mínima en stock antes de sugerir reabastecimiento.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Generando...' : <><Wand2 className="mr-2 h-4 w-4" /> Generar Sugerencias de Reabastecimiento</>}
        </Button>
      </form>
    </Form>
  );
}
