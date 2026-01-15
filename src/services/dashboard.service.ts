import { supabase } from "../config/supabase.client";
import { Budget } from "../types/budget.types";

export const DashboardService = {
  getDashboard: async (user_id: string) => {
    const pinnedBudget = await DashboardService.getPinnedBudget(user_id);
    const latestBudget = await DashboardService.getLatestBudget(user_id);

    return {
      pinned_budget: pinnedBudget || null,
      latest_budget: latestBudget || null,
    };
  },

  getPinnedBudget: async (user_id: string) => {
    const { data: pinnedBudget, error } = await supabase
      .from("budgets")
      .select("id, name, amount, spent, is_pinned")
      .eq("user_id", user_id)
      .eq("is_pinned", true)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return pinnedBudget;
  },

  getLatestBudget: async (user_id: string) => {
    const { data: latestBudget, error } = await supabase
      .from("budgets")
      .select("id, name, amount, spent, is_pinned, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return latestBudget;
  },
};
