export interface BudgetInsightContext {
  budget_name: string;
  total_budget: number;
  spent: number;
  remaining: number;
  percentage_used: number;
}
