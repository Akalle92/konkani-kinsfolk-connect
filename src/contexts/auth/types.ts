
import { Session, User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resetUserState: () => void; // New function to reset user state
  loading: boolean;
}
