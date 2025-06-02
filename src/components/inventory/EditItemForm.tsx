'use client';

import type { InventoryItem } from '@/lib/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Edit3, Save } from 'lucide-react';

const editItemFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  category: z.string().min(1, 'La categoría es requerida.'),
  quantity: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'La cantidad no puede ser negativa.'),
  price: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'El precio no puede ser negativo.'),
});

type EditItemFormValues = z.infer<typeof editItemFormSchema>;

interface EditItemFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEditItem: (itemData: InventoryItem) => void;
  itemToEdit: InventoryItem | null;
}

export function EditItemForm({ isOpen, onOpenChange, onEditItem, itemToEdit }: EditItemFormProps) {
  const { toast } = useToast(); // Not used here, but good practice if toast needed in future
  const form = useForm<EditItemFormValues>({
    resolver: zodResolver(editItemFormSchema),
    defaultValues: {
      name: '',
      category: '',
      quantity: 0,
      price: 0,
    },
  });

  useEffect(() => {
    if (itemToEdit && isOpen) {
      form.reset({
        name: itemToEdit.name,
        category: itemToEdit.category,
        quantity: itemToEdit.quantity,
        price: itemToEdit.price,
      });
    }
  }, [itemToEdit, isOpen, form]);

  const onSubmit: SubmitHandler<EditItemFormValues> = (data) => {
    if (!itemToEdit) return;
    onEditItem({
      ...itemToEdit, // Preserve ID and lastUpdated (will be updated in parent)
      ...data,
    });
    // Toast is handled in InventorySection for consistency
    // form.reset(); // Resetting is handled by useEffect or onOpenChange
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(); // Reset form if dialog is closed without saving
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit3 className="mr-2 h-5 w-5" />
            Editar Artículo
          </DialogTitle>
          <DialogDescription>
            Modifica los detalles del artículo y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        {itemToEdit ? (
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
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <p>No hay artículo seleccionado para editar.</p> // Fallback, should not be seen if logic is correct
        )}
      </DialogContent>
    </Dialog>
  );
}
