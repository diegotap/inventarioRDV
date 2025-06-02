import { ChefHat } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <ChefHat className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-headline text-primary">Valeria's Inventory Hub</h1>
      </div>
    </header>
  );
}
