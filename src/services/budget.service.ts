import { supabase } from "../config/supabase.client";
import { Budget, BudgetRequest } from "../types/budget.types";

export const BudgetService = {
  create: async (data: BudgetRequest): Promise<Budget> => {
    const { count } = await supabase
      .from("budgets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", data.user_id);

    if (count! >= 5) {
      throw new Error("You have reached the maximum number of budgets");
    }

    const { data: budget, error } = await supabase
      .from("budgets")
      .insert(data)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return budget as Budget;
  },

  getAll: async (user_id: string) => {
    const { data: budgets, error } = await supabase
      .from("budgets")
      .select("id, name, description, amount, spent, is_pinned, created_at")
      .eq("user_id", user_id);

    if (error) {
      throw new Error(error.message);
    }

    return budgets as Budget[];
  },

  getOne: async (id: string): Promise<Budget> => {
    const { data: budget, error } = await supabase
      .from("budgets")
      .select("id, name, description, amount, spent, is_pinned, created_at")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return budget as Budget;
  },

  pin: async (budgetId: string, userId: string): Promise<{ id: string }> => {
    // 1. Check if another budget is currently pinned
    const { data: currentPinned, error: fetchError } = await supabase
      .from("budgets")
      .select("id")
      .eq("user_id", userId)
      .eq("is_pinned", true)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // 2. Unpin the currently pinned budget (if different)
    if (currentPinned && currentPinned.id !== budgetId) {
      const { error: unpinError } = await supabase
        .from("budgets")
        .update({ is_pinned: false })
        .eq("id", currentPinned.id)
        .eq("user_id", userId);

      if (unpinError) {
        throw new Error(unpinError.message);
      }
    }

    // 3. Pin the selected budget
    const { data, error: pinError } = await supabase
      .from("budgets")
      .update({ is_pinned: true })
      .eq("id", budgetId)
      .eq("user_id", userId)
      .select("id")
      .single();

    if (pinError) {
      throw new Error(pinError.message);
    }

    return { id: data.id };
  },

  unpin: async (budgetId: string, userId: string): Promise<boolean> => {
    // 1. Check current pin status
    const { data: budget, error: fetchError } = await supabase
      .from("budgets")
      .select("id, is_pinned")
      .eq("id", budgetId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // 2. Already unpinned → no-op
    if (!budget.is_pinned) {
      return false;
    }

    // 3. Unpin
    const { error: updateError } = await supabase
      .from("budgets")
      .update({ is_pinned: false })
      .eq("id", budgetId)
      .eq("user_id", userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return true;
  },

  edit: async (
    budgetId: string,
    userId: string,
    data: BudgetRequest,
  ): Promise<Budget> => {
    // 1. Check ownership first
    const { data: existingBudget, error: fetchError } = await supabase
      .from("budgets")
      .select("id, user_id")
      .eq("id", budgetId)
      .single();

    if (fetchError || !existingBudget) {
      throw new Error("Budget not found");
    }

    if (existingBudget.user_id !== userId) {
      throw new Error("Unauthorized: You do not own this budget");
    }

    // 2. Update budget
    const { data: updatedBudget, error: updateError } = await supabase
      .from("budgets")
      .update(data)
      .eq("id", budgetId)
      .select("*")
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return updatedBudget as Budget;
  },

  delete: async (budgetId: string, userId: string): Promise<boolean> => {
    // 1. Check ownership first
    const { data: existingBudget, error: fetchError } = await supabase
      .from("budgets")
      .select("id, user_id")
      .eq("id", budgetId)
      .single();

    if (fetchError || !existingBudget) {
      throw new Error("Budget not found");
    }

    if (existingBudget.user_id !== userId) {
      throw new Error("Unauthorized: You do not own this budget");
    }

    // 2. Delete budget
    const { error: deleteError } = await supabase
      .from("budgets")
      .delete()
      .eq("id", budgetId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return true;
  },
};
