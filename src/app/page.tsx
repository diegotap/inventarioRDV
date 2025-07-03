'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { InventoryItem } from '@/lib/types';
import { InventorySection } from '@/components/inventory/InventorySection';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ReportHistory } from '@/components/reports/ReportHistory';

export default function Home() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(authStatus);
    setUserRole(role);
    if (!authStatus) {
      router.replace('/login');
    } else {
      fetch('/api/productos')
        .then(res => res.json())
        .then(data => setInventoryItems(data));
      setIsClient(true);
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
        <header className="bg-card shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Image
                src="/log_rdv.png"
                alt="Logo Rincón de Valeria"
                width={32}
                height={32}
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-2xl md:text-3xl font-headline text-primary">
                Inventario Rincón de Valeria
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              {userRole && (
                <Button
                  className="bg-primary text-white font-semibold shadow-none border-none hover:bg-primary/90 cursor-default w-full sm:w-auto px-2 py-1 text-xs md:px-4 md:py-2 md:text-base"
                >
                  {userRole === 'admin' ? 'Administrador' : 'Usuario'}
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto p-4 md:p-8 pt-4">
          <div className="space-y-8">
            {userRole === 'admin' && (
              <div className="mb-8">
                <ReportHistory />
              </div>
            )}
            <InventorySection
              items={inventoryItems}
              onItemsChange={handleInventoryUpdate}
              userRole={userRole}
            />
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
