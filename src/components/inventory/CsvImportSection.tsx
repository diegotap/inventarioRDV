'use client';

import type { InventoryItem } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { CsvImportForm } from './CsvImportForm';
import { FileUp } from 'lucide-react';

interface CsvImportSectionProps {
  onInventoryUpdate: (newItems: InventoryItem[]) => void;
}

export function CsvImportSection({ onInventoryUpdate }: CsvImportSectionProps) {
  const handleImport = (importedData: InventoryItem[]) => {
    // Here, you could merge with existing inventory or replace it.
    // For simplicity, this example replaces the inventory.
    // A more robust implementation might check for existing items by name/ID and update them.
    onInventoryUpdate(importedData);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <FileUp className="h-6 w-6 mr-2 text-primary" />
          <CardTitle className="font-headline text-2xl">Importar Inventario desde CSV</CardTitle>
        </div>
        <CardDescription>Sube un archivo CSV para añadir o actualizar artículos en tu inventario.</CardDescription>
      </CardHeader>
      <CardContent>
        <CsvImportForm onImport={handleImport} />
      </CardContent>
    </Card>
  );
}
