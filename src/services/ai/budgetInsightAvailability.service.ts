import { supabase } from "../../config/supabase.client";

export async function hasInsightToday(
  userId: string,
  budgetId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("budget_insights")
    .select("id")
    .eq("user_id", userId)
    .eq("budget_id", budgetId)
    .eq("created_at", new Date().toISOString().slice(0, 10))
    .maybeSingle();

  return !!data;
}
