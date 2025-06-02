'use client';

import type { InventoryItem } from '@/lib/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // No es necesario si se usa FormLabel
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PackagePlus, Save } from 'lucide-react';

const addItemFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  category: z.string().min(1, 'La categoría es requerida.'),
  quantity: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'La cantidad no puede ser negativa.'),
  price: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'El precio no puede ser negativo.'),
});

type AddItemFormValues = z.infer<typeof addItemFormSchema>;

interface AddItemFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddItem: (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
}

export function AddItemForm({ isOpen, onOpenChange, onAddItem }: AddItemFormProps) {
  const { toast } = useToast();
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemFormSchema),
    defaultValues: {
      name: '',
      category: '',
      quantity: 0,
      price: 0,
    },
  });

  const onSubmit: SubmitHandler<AddItemFormValues> = (data) => {
    onAddItem(data);
    toast({
      title: 'Artículo Agregado',
      description: `"${data.name}" ha sido añadido al inventario.`,
    });
    form.reset(); // Limpiar el formulario después de enviar
    onOpenChange(false); // Cerrar el diálogo
  };

  // Asegurarse de resetear el formulario si el diálogo se cierra sin guardar
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PackagePlus className="mr-2 h-5 w-5" />
            Agregar Nuevo Artículo
          </DialogTitle>
          <DialogDescription>
            Completa los detalles del nuevo artículo para añadirlo al inventario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Artículo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Tomates Frescos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Verduras" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (S/)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 2.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar Artículo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
