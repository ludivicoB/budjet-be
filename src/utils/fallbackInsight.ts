import { BudgetInsightContext } from "../types/global.types";

export function fallbackInsight(ctx: BudgetInsightContext): string {
  if (ctx.percentage_used >= 100) {
    return "You have exceeded your budget. Consider reviewing recent expenses.";
  }

  if (ctx.percentage_used >= 80) {
    return "You are close to your budget limit. Try reducing discretionary spending.";
  }

  if (ctx.percentage_used >= 50) {
    return "Your spending is moderate. Keep tracking expenses to stay on target.";
  }

  return "Your spending is healthy and well within your budget.";
}
