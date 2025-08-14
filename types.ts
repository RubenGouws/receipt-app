
export interface Expense {
  id: string;
  merchant: string;
  date: string; // YYYY-MM-DD
  amount: number;
  currency: string;
  category: string;
  description: string;
}

export interface ScannedExpenseData {
  merchant?: string;
  date?: string; // YYYY-MM-DD
  totalAmount?: number;
  currency?: string;
}
