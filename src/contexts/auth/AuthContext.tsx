
import { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, UserRole } from "./types";
import { fetchUserRole } from "./utils";
import { 
  signUpOperation,
  signInOperation,
  signOutOperation,
  resetPasswordOperation,
  updatePasswordOperation,
  ToastParams
} from "./operations";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to reset all user states
  const resetUserState = () => {
    console.log("Resetting all user states");
    setSession(null);
    setUser(null);
    setUserRole(null);
  };

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
          const role = await fetchUserRole(data.session.user.id);
          setUserRole(role);
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
          const role = await fetchUserRole(currentSession.user.id);
          setUserRole(role);
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

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signUpOperation(email, password, (params: ToastParams) => toast(params));
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInOperation(email, password, (params: ToastParams) => toast(params));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await signOutOperation((params: ToastParams) => toast(params));
      resetUserState(); // Explicitly reset state after sign out
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await resetPasswordOperation(email, (params: ToastParams) => toast(params));
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      await updatePasswordOperation(newPassword, (params: ToastParams) => toast(params));
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
        resetUserState, // Expose the reset function
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
