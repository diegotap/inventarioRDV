export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lastUpdated: string; // ISO date string
}

export interface ReorderSuggestionItem {
  itemName: string;
  quantityToReorder: number;
  reason: string;
}

// For the GenAI flow input
export type SuggestReorderInput = {
  salesData: string; // CSV format
  currentStockLevels: string; // CSV format
  reorderThreshold: number;
};

// For the GenAI flow output
export type SuggestReorderOutput = {
  itemsToReorder: ReorderSuggestionItem[];
};
