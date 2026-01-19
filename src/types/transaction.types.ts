export interface Transaction {
  id: string;
  user_id: string;
  budget_id: string;
  amount: number;
  type: string;
  description: string;
  category: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionRequest {
  amount: number;
  type: string;
  description?: string;
  category?: string;
  transaction_date: string;
}

export interface TransactionBudgetResponse {
  budget_details: {
    name: string;
    spent: number;
    amount: number;
  }
  transactions: Transaction[]
}

export interface TransactionEditResponse {
  budget_details: {
    name: string;
    spent: number;
    amount: number;
  },
  edited_transaction: Transaction
}