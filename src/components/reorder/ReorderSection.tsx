'use client';

import type { ReorderSuggestionItem } from '@/lib/types';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ReorderForm } from './ReorderForm';
import { ReorderSuggestionsList } from './ReorderSuggestionsList';
import { BrainCircuit } from 'lucide-react';

export function ReorderSection() {
  const [suggestions, setSuggestions] = useState<ReorderSuggestionItem[]>([]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
          <CardTitle className="font-headline text-2xl">Herramienta de Reabastecimiento IA</CardTitle>
        </div>
        <CardDescription>
          Obtén sugerencias automáticas para reabastecer artículos basadas en tendencias de ventas y niveles de stock actuales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReorderForm onSuggestions={setSuggestions} />
        { (suggestions.length > 0 || !suggestions ) && <ReorderSuggestionsList suggestions={suggestions} /> }
      </CardContent>
    </Card>
  );
}
