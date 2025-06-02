'use server';

import type { SuggestReorderInput, SuggestReorderOutput } from '@/lib/types';
import { suggestReorder as suggestReorderFlow } from '@/ai/flows/reorder-suggestions';

export async function handleReorderSuggestion(
  data: SuggestReorderInput
): Promise<SuggestReorderOutput | { error: string }> {
  try {
    const result = await suggestReorderFlow(data);
    if (!result || !result.itemsToReorder) {
      // Check if the AI produced a valid structure, even if empty
      if (result && typeof result === 'object' && 'itemsToReorder' in result && Array.isArray(result.itemsToReorder)) {
        return { itemsToReorder: result.itemsToReorder };
      }
      return { error: 'AI failed to provide valid reorder suggestions.' };
    }
    return result;
  } catch (error) {
    console.error('Error calling AI reorder suggestion flow:', error);
    return { error: 'An unexpected error occurred while generating reorder suggestions.' };
  }
}
