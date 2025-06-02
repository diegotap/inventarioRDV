'use client';

import type { InventoryItem } from '@/lib/types';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileCsv, Upload } from 'lucide-react';

interface CsvImportFormProps {
  onImport: (data: InventoryItem[]) => void;
}

export function CsvImportForm({ onImport }: CsvImportFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({ title: 'Error', description: 'Por favor, selecciona un archivo CSV.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== ''); // Handles different line endings and empty lines
        
        // Skip header if present (simple check for common header names)
        const headerLine = lines[0]?.toLowerCase();
        const contentLines = (headerLine?.includes('name') || headerLine?.includes('nombre')) ? lines.slice(1) : lines;

        const importedItems: InventoryItem[] = contentLines.map((line, index) => {
          const values = line.split(',');
          if (values.length < 4) { // Expecting at least name, category, quantity, price
            throw new Error(`Línea ${index + 1}: formato incorrecto. Se esperan al menos 4 columnas (nombre, categoría, cantidad, precio).`);
          }
          const [name, category, quantityStr, priceStr, ...rest] = values; // ...rest to handle potential extra columns gracefully
          
          const quantity = parseFloat(quantityStr);
          const price = parseFloat(priceStr);

          if (isNaN(quantity) || isNaN(price)) {
            throw new Error(`Línea ${index + 1}: Cantidad o precio no es un número válido.`);
          }
          
          return {
            id: `${Date.now()}-${index}`, // Simple unique ID
            name: name.trim(),
            category: category.trim(),
            quantity: quantity,
            price: price,
            lastUpdated: new Date().toISOString(),
          };
        });
        onImport(importedItems);
        toast({ title: 'Éxito', description: `${importedItems.length} artículos importados correctamente.` });
        setFile(null); 
        // Reset file input visually - a bit tricky with controlled file inputs.
        // This targets the form to reset it which clears the file input.
        if (event.currentTarget) {
            event.currentTarget.reset();
        }
      } catch (error: any) {
        toast({ title: 'Error de Importación', description: error.message || 'No se pudo procesar el archivo CSV.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="csv-file-input" className="mb-2 flex items-center">
          <FileCsv className="h-5 w-5 mr-2 text-muted-foreground" />
          Seleccionar archivo CSV para importar
        </Label>
        <Input
          id="csv-file-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file:text-primary file:font-medium file:bg-primary-foreground hover:file:bg-accent/20"
          disabled={isLoading}
        />
         <p className="text-xs text-muted-foreground mt-1">
          Formato esperado: nombre,categoría,cantidad,precio (sin cabecera o con cabecera "nombre,categoria,cantidad,precio").
        </p>
      </div>
      <Button type="submit" disabled={isLoading || !file} className="w-full sm:w-auto">
        {isLoading ? 'Importando...' : <><Upload className="mr-2 h-4 w-4" /> Importar Inventario</>}
      </Button>
    </form>
  );
}
