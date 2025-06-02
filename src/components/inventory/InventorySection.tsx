'use client';

import type { InventoryItem } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { InventorySearch } from './InventorySearch';
import { InventoryTable } from './InventoryTable';
import { PackageSearch } from 'lucide-react';

interface InventorySectionProps {
  initialItems: InventoryItem[];
}

export function InventorySection({ initialItems }: InventorySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // This component receives initialItems, but if items are updated globally (e.g. by CSVImport),
  // this component needs to reflect that. For now, it uses initialItems and filters them.
  // A more robust solution would involve a shared state (Context or Zustand) or prop drilling from page.tsx.
  // For this iteration, we'll assume initialItems is the source of truth for this component's render cycle,
  // and filtering happens on this set. If page.tsx updates initialItems, this will re-render.

  const filteredItems = useMemo(() => {
    if (!searchTerm) return initialItems;
    return initialItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialItems, searchTerm]);

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
        <InventorySearch onSearch={setSearchTerm} />
        <InventoryTable items={filteredItems} />
      </CardContent>
    </Card>
  );
}
