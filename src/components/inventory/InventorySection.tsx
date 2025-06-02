'use client';

import type { InventoryItem } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { InventorySearch } from './InventorySearch';
import { InventoryTable } from './InventoryTable';
import { Button } from '@/components/ui/button';
import { PackageSearch, FileText, PackagePlus } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AddItemForm } from './AddItemForm'; // Importar el nuevo componente

interface InventorySectionProps {
  items: InventoryItem[];
  onItemsChange: (newItems: InventoryItem[]) => void;
}

export function InventorySection({ items, onItemsChange }: InventorySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

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
        const pageCount = data.doc.getNumberOfPages(); // Correct way to get page count
        doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save('reporte_inventario.pdf');
  };

  const handleAddItem = (newItemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generar ID único
      lastUpdated: new Date().toISOString(),
    };
    onItemsChange([...items, newItem]);
    setIsAddItemDialogOpen(false); // Cerrar el diálogo después de agregar
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
          <InventoryTable items={filteredItems} />
        </CardContent>
      </Card>
      <AddItemForm
        isOpen={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        onAddItem={handleAddItem}
      />
    </>
  );
}
