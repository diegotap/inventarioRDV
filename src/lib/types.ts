export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lastUpdated: string; // ISO date string
}

// ReorderSuggestionItem, SuggestReorderInput, SuggestReorderOutput types removed
