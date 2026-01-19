import { supabase } from "../config/supabase.client";
import {
  Transaction,
  TransactionBudgetResponse,
  TransactionEditResponse,
  TransactionRequest,
} from "../types/transaction.types";

export const TransactionService = {
  create: async (
    user_id: string,
    budget_id: string,
    data: TransactionRequest,
  ): Promise<TransactionEditResponse> => {
    const { data: budget, error: fetchError } = await supabase
      .from("budgets")
      .select("id, user_id, amount, spent")
      .eq("id", budget_id)
      .single();

    if (fetchError || !budget) {
      throw new Error("Budget not found");
    }

    if (budget.user_id !== user_id) {
      throw new Error("Unauthorized: You do not own this budget");
    }

    if (budget.spent + data.amount > budget.amount) {
      throw new Error("Transaction amount exceeds budget amount");
    }

    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert({
        ...data,
        budget_id,
        user_id,
      })
      .select(
        "id, budget_id, amount, type, description, category, transaction_date",
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const { data: updatedBudget, error: fetchBudgetError } = await supabase
      .from("budgets")
      .select("id, name, spent, amount")
      .eq("id", transaction.budget_id)
      .single();

    if (fetchBudgetError || !updatedBudget) {
      throw new Error("Budget not found");
    }

    return {
      budget_details: {
        name: updatedBudget.name,
        spent: updatedBudget.spent,
        amount: updatedBudget.amount,
      },
      edited_transaction: transaction as Transaction,
    };
  },

  getAll: async (user_id: string): Promise<Transaction[]> => {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(
        "id, budget_id, amount, type, description, category, transaction_date, created_at",
      )
      .eq("user_id", user_id);
    if (error) {
      throw new Error(error.message);
    }

    return transactions as Transaction[];
  },

  getAllPerBudget: async (
    user_id: string,
    budget_id: string,
  ): Promise<TransactionBudgetResponse> => {
    // 1. Check ownership first
    const { data: budget, error: fetchError } = await supabase
      .from("budgets")
      .select("id, user_id, name, spent, amount")
      .eq("id", budget_id)
      .single();

    if (fetchError || !budget) {
      throw new Error("Budget not found");
    }

    if (budget.user_id !== user_id) {
      throw new Error("Unauthorized: You do not own this budget");
    }

    // 2. Get Transaction under budget
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(
        "id, budget_id, amount, type, description, category, transaction_date, created_at",
      )
      .eq("budget_id", budget_id)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    const budget_details = {
      name: budget.name,
      spent: budget.spent,
      amount: budget.amount,
    };

    return {
      budget_details,
      transactions: transactions as Transaction[],
    };
  },

  edit: async (
    user_id: string,
    transaction_id: string,
    data: TransactionRequest,
  ): Promise<TransactionEditResponse> => {
    // 1. Check ownership first
    const { data: existingTransaction, error: fetchError } = await supabase
      .from("transactions")
      .select("id, user_id")
      .eq("id", transaction_id)
      .single();

    if (fetchError || !existingTransaction) {
      throw new Error("Transaction not found");
    }

    if (existingTransaction.user_id !== user_id) {
      throw new Error("Unauthorized: You do not own this transaction");
    }

    // 2. Update transaction
    const { data: updatedTransaction, error: updateError } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", transaction_id)
      .select(
        "id, budget_id, amount, type, description, category, transaction_date",
      )
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    // 3. Updated Budget details
    const { data: updatedBudget, error: fetchBudgetError } = await supabase
      .from("budgets")
      .select("id, name, spent, amount")
      .eq("id", updatedTransaction.budget_id)
      .single();

    if (fetchBudgetError || !updatedBudget) {
      throw new Error("Budget not found");
    }

    return {
      budget_details: {
        name: updatedBudget.name,
        spent: updatedBudget.spent,
        amount: updatedBudget.amount,
      },
      edited_transaction: updatedTransaction as Transaction,
    };
  },

  delete: async (user_id: string, transaction_id: string): Promise<boolean> => {
    // 1. Check ownership first
    const { data: existingTransaction, error: fetchError } = await supabase
      .from("transactions")
      .select("id, user_id")
      .eq("id", transaction_id)
      .single();

    if (fetchError || !existingTransaction) {
      throw new Error("Transaction not found");
    }

    if (existingTransaction.user_id !== user_id) {
      throw new Error("Unauthorized: You do not own this transaction");
    }

    // 2. Delete transaction
    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transaction_id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return true;
  },
};
