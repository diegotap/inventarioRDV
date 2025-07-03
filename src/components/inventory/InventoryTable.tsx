'use client';

import type { InventoryItem } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, PackageSearch } from 'lucide-react';

interface InventoryTableProps {
  readonly items: InventoryItem[];
  readonly onEditItem: (item: InventoryItem) => void;
  readonly onDeleteItem: (item: InventoryItem) => void;
  readonly userRole: string | null;
}

export function InventoryTable({ items, onEditItem, onDeleteItem, userRole }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed rounded-lg">
        <PackageSearch className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl font-medium text-muted-foreground">No hay artículos en el inventario.</p>
        <p className="text-sm text-muted-foreground">Agrega un articulo al inventario.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className="py-2 px-3 text-sm">Nombre</TableHead>
            <TableHead className="py-2 px-3 text-sm">Categoría</TableHead>
            <TableHead className="py-2 px-3 text-sm text-right">Cantidad</TableHead>
            <TableHead className="py-2 px-3 text-sm">Unidad</TableHead>
            <TableHead className="py-2 px-3 text-sm">Última Actualización</TableHead>
            <TableHead className="py-2 px-3 text-sm text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="py-2 px-3 text-sm font-medium">{item.nombre}</TableCell>
              <TableCell className="py-2 px-3 text-sm">{item.categoria}</TableCell>
              <TableCell className="py-2 px-3 text-sm text-right">{item.cantidad}</TableCell>
              <TableCell className="py-2 px-3 text-sm">{item.unidad}</TableCell>
              <TableCell className="py-2 px-3 text-sm">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('es-ES')
                  : ''}
              </TableCell>
              <TableCell className="py-2 px-3 text-sm text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  aria-label={`Editar ${item.nombre}`}
                  onClick={() => onEditItem(item)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  aria-label={`Eliminar ${item.nombre}`}
                  onClick={() => onDeleteItem(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
