// use server'

/**
 * @fileOverview An AI agent that suggests items for reordering based on sales data and current stock levels.
 *
 * - suggestReorder - A function that suggests items for reordering.
 * - SuggestReorderInput - The input type for the suggestReorder function.
 * - SuggestReorderOutput - The return type for the suggestReorder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReorderInputSchema = z.object({
  salesData: z.string().describe('Sales data in CSV format, including item name and quantity sold.'),
  currentStockLevels: z.string().describe('Current stock levels in CSV format, including item name and quantity in stock.'),
  reorderThreshold: z.number().describe('The threshold below which an item should be reordered.'),
});
export type SuggestReorderInput = z.infer<typeof SuggestReorderInputSchema>;

const SuggestReorderOutputSchema = z.object({
  itemsToReorder: z.array(
    z.object({
      itemName: z.string().describe('The name of the item to reorder.'),
      quantityToReorder: z.number().describe('The quantity of the item to reorder.'),
      reason: z.string().describe('The reason for suggesting the reorder.'),
    })
  ).describe('A list of items to reorder with quantities and reasons.'),
});
export type SuggestReorderOutput = z.infer<typeof SuggestReorderOutputSchema>;

export async function suggestReorder(input: SuggestReorderInput): Promise<SuggestReorderOutput> {
  return suggestReorderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReorderPrompt',
  input: {schema: SuggestReorderInputSchema},
  output: {schema: SuggestReorderOutputSchema},
  prompt: `You are a restaurant inventory management expert. Analyze the sales data and current stock levels to suggest items for reordering.

Sales Data:
{{salesData}}

Current Stock Levels:
{{currentStockLevels}}

Reorder Threshold: {{reorderThreshold}}

Consider sales trends, current stock, and the reorder threshold to determine which items need reordering. Provide the item name, quantity to reorder, and a brief reason for the suggestion.

Format your output as a JSON array of objects, where each object has the following keys:
- itemName: string
- quantityToReorder: number
- reason: string`,
});

const suggestReorderFlow = ai.defineFlow(
  {
    name: 'suggestReorderFlow',
    inputSchema: SuggestReorderInputSchema,
    outputSchema: SuggestReorderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
