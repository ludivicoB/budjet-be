import { supabase } from "../config/supabase.client";

interface Test {
  id: string;
  test_name: string;
}

export const TestService = {
  getTest: async () => {
    const { data: Test, error } = await supabase.from("test").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return Test as Test[];
  },
};
