'use client';

import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface InventorySearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function InventorySearch({ onSearch, className }: InventorySearchProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar en inventario..."
        onChange={handleInputChange}
        className="pl-10 w-full md:w-1/3"
        aria-label="Buscar en inventario"
      />
    </div>
  );
}
