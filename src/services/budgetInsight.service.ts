import { geminiService } from "../config/gemini.client";
import { supabase } from "../config/supabase.client";
import { fallbackInsight } from "../utils/fallbackInsight";
import { buildBudgetPrompt } from "../utils/prompt";
import { hasInsightToday } from "./ai/budgetInsightAvailability.service";
import { getBudgetInsightContext } from "./ai/budgetInsightContext.service";

export async function generateBudgetInsight(
  userId: string,
  budgetId: string,
): Promise<{ insight: string; fromAI: boolean }> {
  // 1. Enforce once per day
  const existingID = await hasInsightToday(userId, budgetId);
  if (existingID) {
    const { data: existingInsight } = await supabase
      .from("budget_insights")
      .select("insight")
      .eq("id", existingID)
      .single();
    return { insight: existingInsight?.insight, fromAI: false };
  }

  // 2. Aggregate context
  const context = await getBudgetInsightContext(budgetId, userId);

  // 3. Try AI
  let insight: string;
  let fromAI = true;

  try {
    insight = await geminiService.generateText(buildBudgetPrompt(context));
  } catch (error: any) {
    console.error("Gemini error", error);
    insight = fallbackInsight(context);
    fromAI = false;
  }

  // 4. Persist result
  await supabase.from("budget_insights").insert({
    user_id: userId,
    budget_id: budgetId,
    insight,
  });

  return { insight, fromAI };
}
