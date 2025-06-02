'use client';

import type { InventoryItem } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { InventorySearch } from './InventorySearch';
import { InventoryTable } from './InventoryTable';
import { Button } from '@/components/ui/button';
import { PackageSearch, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InventorySectionProps {
  initialItems: InventoryItem[];
}

export function InventorySection({ initialItems }: InventorySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm) return initialItems;
    return initialItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialItems, searchTerm]);

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
      headStyles: { fillColor: [240, 72, 72] }, // Primary color (Tomato Red)
      styles: { font: "helvetica", fontSize: 8 },
      didDrawPage: (data) => {
        // Footer
        // Usar data.pageCount proporcionado por jspdf-autotable
        doc.setFontSize(8);
        doc.text(`Página ${data.pageNumber} de ${data.pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save('reporte_inventario.pdf');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PackageSearch className="h-6 w-6 mr-2 text-primary" />
            <CardTitle className="font-headline text-2xl">Inventario Actual</CardTitle>
          </div>
        </div>
        <CardDescription>Busca y gestiona los artículos de tu inventario.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <InventorySearch onSearch={setSearchTerm} className="w-full md:flex-grow" />
          <Button
            onClick={handleGeneratePdf}
            disabled={filteredItems.length === 0}
            className="w-full md:w-auto whitespace-nowrap"
          >
            <FileText className="mr-2 h-4 w-4" />
            Finalizar conteo de inventario
          </Button>
        </div>
        <InventoryTable items={filteredItems} />
      </CardContent>
    </Card>
  );
}
