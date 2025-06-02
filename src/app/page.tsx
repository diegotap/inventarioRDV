
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { InventoryItem } from '@/lib/types';
import { mockInventory } from '@/data/mock-inventory';
import { Header } from '@/components/layout/Header';
import { InventorySection } from '@/components/inventory/InventorySection';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      router.replace('/login'); // Use replace to avoid page in history
    } else {
      setInventoryItems(mockInventory);
      setIsClient(true); // Only set isClient if authenticated
    }
  }, [router]);

  const handleInventoryUpdate = (updatedItems: InventoryItem[]) => {
    setInventoryItems(updatedItems);
    // In a real app, persist changes (e.g., localStorage or backend)
    // For now, it's in-memory for this session.
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false); // Update local auth state
    toast({
      title: 'Sesión Cerrada',
      description: 'Has cerrado sesión exitosamente.',
    });
    router.push('/login'); // Redirect to login
  };

  // Initial loading/redirecting state
  if (!isClient && !isAuthenticated) {
     // If useEffect hasn't run yet or explicitly not authenticated but trying to access
    if (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') !== 'true') {
      // This direct check helps in scenarios where router push might be slow
      // or if direct navigation attempt before effect runs
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-xl mb-4 text-foreground">Cargando...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // If authenticated, show the inventory page
  if (isAuthenticated && isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-4 md:px-8 md:pt-4 md:pb-0 flex justify-end">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
        <main className="flex-grow container mx-auto p-4 md:p-8 pt-4">
          <div className="space-y-8">
            <InventorySection items={inventoryItems} onItemsChange={handleInventoryUpdate} />
          </div>
        </main>
      </div>
    );
  }

  // Fallback for any other state, though ideally covered by above
  // This helps prevent rendering anything if not authenticated and client check is done
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-xl mb-4 text-foreground">Verificando autenticación...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
  );
}
