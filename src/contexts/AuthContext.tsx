
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth Provider initializing...");
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          return;
        }
        
        if (data?.session) {
          console.log("Initial session found for user:", data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          await fetchUserRole(data.session.user.id);
        } else {
          console.log("No initial session found");
        }
      } catch (error) {
        console.error("Fatal error during auth initialization:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
        } else {
          setUserRole(null);
        }
        
        // Show toast for certain auth events
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!"
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out successfully",
            description: "You have been logged out"
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password reset requested",
            description: "Please check your email"
          });
        }
      }
    );

    return () => {
      console.log("Unsubscribing from auth changes");
      subscription.unsubscribe();
    };
  }, [toast]);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error.message);
        return;
      }

      console.log("User role fetched:", data);
      setUserRole(data);
    } catch (error) {
      console.error("Exception in fetchUserRole:", error);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Attempting signup for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });

      if (error) throw error;
      
      console.log("Signup successful:", data);
      toast({
        title: "Account created!",
        description: "Please check your email for verification."
      });
    } catch (error: any) {
      console.error("Signup error:", error.message);
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Attempting signin for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Signin successful:", data.user?.id);
    } catch (error: any) {
      console.error("Signin error:", error.message);
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log("Attempting signout");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Signout successful");
    } catch (error: any) {
      console.error("Signout error:", error.message);
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      console.log("Attempting password reset for:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      console.log("Password reset email sent");
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for instructions."
      });
    } catch (error: any) {
      console.error("Password reset error:", error.message);
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      console.log("Attempting to update password");
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      console.log("Password updated successfully");
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      });
    } catch (error: any) {
      console.error("Update password error:", error.message);
      toast({
        title: "Password Update Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
