
import { supabase } from "@/integrations/supabase/client";

export const fetchUserRole = async (userId: string) => {
  try {
    console.log("Fetching user role for:", userId);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();  // Changed from .single() to .maybeSingle() to handle no results

    if (error) {
      console.error("Error fetching user role:", error.message);
      return null;
    }

    console.log("User role fetched:", data);
    return data;
  } catch (error) {
    console.error("Exception in fetchUserRole:", error);
    return null;
  }
};
