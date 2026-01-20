import { BudgetInsightContext } from "../types/global.types";

export function buildBudgetPrompt(ctx: BudgetInsightContext): string {
  return `
You are a friendly financial assistant.
Give ONE short, actionable insight in a friendly tone.
Max 2 sentences.
No emojis.

Budget:
Total: ₱ ${ctx.total_budget}
Spent: ₱ ${ctx.spent}
Remaining: ₱ ${ctx.remaining}
Used: ${ctx.percentage_used}%
`;
}
