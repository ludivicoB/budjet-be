export interface Budget {
  id: string;
  user_id: string;
  name: string;
  description: string;
  amount: number;
  spent: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface BudgetRequest {
  user_id: string;
  name: string;
  description?: string;
  amount: number;
}
