
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "./types";

export async function fetchUserRole(userId: string): Promise<UserRole | null> {
  try {
    console.log("Fetching user role for:", userId);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user role:", error.message);
      return null;
    }

    console.log("User role data:", data);
    return data;
  } catch (err) {
    console.error("Exception fetching user role:", err);
    return null;
  }
}
