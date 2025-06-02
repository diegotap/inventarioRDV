'use client';

import type { ReorderSuggestionItem } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListOrdered } from 'lucide-react';

interface ReorderSuggestionsListProps {
  suggestions: ReorderSuggestionItem[];
}

export function ReorderSuggestionsList({ suggestions }: ReorderSuggestionsListProps) {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed rounded-lg">
        <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No hay sugerencias de reabastecimiento en este momento.</p>
        <p className="text-xs text-muted-foreground">Intenta generar sugerencias con nuevos datos.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border shadow-sm mt-4">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead>Artículo</TableHead>
            <TableHead className="text-right">Cantidad a Reabastecer</TableHead>
            <TableHead>Razón</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.itemName}</TableCell>
              <TableCell className="text-right">{item.quantityToReorder}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
