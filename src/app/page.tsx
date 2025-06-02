'use client';

import { useState, useEffect } from 'react';
import type { InventoryItem } from '@/lib/types';
import { mockInventory } from '@/data/mock-inventory';
import { Header } from '@/components/layout/Header';
import { InventorySection } from '@/components/inventory/InventorySection';

export default function Home() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Load initial mock data only on the client-side after hydration
    setInventoryItems(mockInventory);
    setIsClient(true);
  }, []);

  // Render a loading state or null until client-side hydration is complete
  // to avoid potential hydration mismatches with mockInventory.
  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 animate-pulse">
          <div className="space-y-8">
            <div className="h-64 bg-muted rounded-lg"></div>
            {/* Placeholder for removed CSV import section */}
            {/* <div className="h-48 bg-muted rounded-lg"></div> */}
            {/* Placeholder for removed Reorder section */}
            {/* <div className="h-96 bg-muted rounded-lg"></div> */}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          <InventorySection initialItems={inventoryItems} />
          {/* CSVImportSection removed */}
          {/* ReorderSection removed */}
        </div>
      </main>
    </div>
  );
}
