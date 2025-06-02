'use client';

import type { InventoryItem } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { InventorySearch } from './InventorySearch';
import { InventoryTable } from './InventoryTable';
import { Button } from '@/components/ui/button';
import { PackageSearch, FileText, PackagePlus, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AddItemForm } from './AddItemForm';
import { EditItemForm } from './EditItemForm'; // Nuevo componente
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface InventorySectionProps {
  items: InventoryItem[];
  onItemsChange: (newItems: InventoryItem[]) => void;
}

export function InventorySection({ items, onItemsChange }: InventorySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Inventario", 14, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 26);

    const tableColumn = ["ID", "Nombre", "Categoría", "Cantidad", "Precio (€)", "Última Actualización"];
    const tableRows: any[][] = [];

    const itemsToReport = filteredItems; 

    itemsToReport.forEach(item => {
      const itemData = [
        item.id,
        item.name,
        item.category,
        item.quantity,
        item.price.toFixed(2),
        new Date(item.lastUpdated).toLocaleDateString('es-ES'),
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [240, 72, 72] }, 
      styles: { font: "helvetica", fontSize: 8 },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        const pageCount = doc.getNumberOfPages(); 
        doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save('reporte_inventario.pdf');
  };

  const handleAddItem = (newItemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString(),
    };
    onItemsChange([...items, newItem]);
    setIsAddItemDialogOpen(false);
  };

  const handleOpenEditDialog = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsEditItemDialogOpen(true);
  };

  const handleEditItem = (updatedItemData: InventoryItem) => {
    const updatedItems = items.map(item => 
      item.id === updatedItemData.id ? { ...updatedItemData, lastUpdated: new Date().toISOString() } : item
    );
    onItemsChange(updatedItems);
    setIsEditItemDialogOpen(false);
    setItemToEdit(null);
    toast({
      title: 'Artículo Actualizado',
      description: `"${updatedItemData.name}" ha sido actualizado.`,
    });
  };

  const handleOpenDeleteDialog = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const updatedItems = items.filter(item => item.id !== itemToDelete.id);
    onItemsChange(updatedItems);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Artículo Eliminado',
      description: `"${itemToDelete.name}" ha sido eliminado del inventario.`,
      variant: 'destructive',
    });
    setItemToDelete(null);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PackageSearch className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="font-headline text-2xl">Inventario Actual</CardTitle>
            </div>
          </div>
          <CardDescription>Busca, gestiona y añade artículos a tu inventario.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <InventorySearch onSearch={setSearchTerm} className="w-full md:flex-grow" />
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                onClick={() => setIsAddItemDialogOpen(true)}
                className="w-full md:w-auto whitespace-nowrap"
              >
                <PackagePlus className="mr-2 h-4 w-4" />
                Agregar Artículo
              </Button>
              <Button
                onClick={handleGeneratePdf}
                disabled={filteredItems.length === 0}
                className="w-full md:w-auto whitespace-nowrap"
              >
                <FileText className="mr-2 h-4 w-4" />
                Finalizar conteo de inventario
              </Button>
            </div>
          </div>
          <InventoryTable 
            items={filteredItems} 
            onEditItem={handleOpenEditDialog}
            onDeleteItem={handleOpenDeleteDialog}
          />
        </CardContent>
      </Card>

      <AddItemForm
        isOpen={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        onAddItem={handleAddItem}
      />

      {itemToEdit && (
        <EditItemForm
          isOpen={isEditItemDialogOpen}
          onOpenChange={setIsEditItemDialogOpen}
          onEditItem={handleEditItem}
          itemToEdit={itemToEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
              ¿Estás seguro de eliminar este artículo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo "{itemToDelete?.name}" de tu inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
