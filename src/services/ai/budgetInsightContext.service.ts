import { supabase } from "../../config/supabase.client";
import { BudgetInsightContext } from "../../types/global.types";

export async function getBudgetInsightContext(
  budgetId: string,
  userId: string,
): Promise<BudgetInsightContext> {
  const { data: budget, error } = await supabase
    .from("budgets")
    .select("name, amount, spent")
    .eq("id", budgetId)
    .eq("user_id", userId)
    .single();

  if (error || !budget) {
    throw new Error("Budget not found");
  }

  const percentageUsed = Math.round((budget.spent / budget.amount) * 100);

  return {
    budget_name: budget.name,
    total_budget: budget.amount,
    spent: budget.spent,
    remaining: budget.amount - budget.spent,
    percentage_used: percentageUsed,
  };
}
