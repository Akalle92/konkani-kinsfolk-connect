
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

// Define our new AuthContext type with Clerk
export interface ClerkAuthContextType {
  user: any;
  userRole: any | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resetUserState: () => void;
  loading: boolean;
}

// Create the context
export const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

// Auth provider component
export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, signOut: clerkSignOut } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<any | null>(null);

  // Check for user role once we have a user
  useEffect(() => {
    const fetchUserRole = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          if (!error && data) {
            setUserRole(data);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    if (userId) {
      fetchUserRole();
    }
  }, [userId]);

  // Handle initial loading
  useEffect(() => {
    if (isLoaded && isUserLoaded) {
      setLoading(false);
    }
  }, [isLoaded, isUserLoaded]);

  // Implement auth methods that were previously in Supabase
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This will be handled by Clerk's SignUp component
      console.log("Sign up with", email, password);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This will be handled by Clerk's SignIn component
      console.log("Sign in with", email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await clerkSignOut();
      // Clear any local session state
      resetUserState();
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log("Reset password for", email);
    // Clerk handles this differently through their components
  };

  const updatePassword = async (newPassword: string) => {
    console.log("Update password to", newPassword);
    // Clerk handles this differently through their components
  };

  const resetUserState = () => {
    // Clear any local state
    setUserRole(null);
  };

  return (
    <ClerkAuthContext.Provider
      value={{
        user: user,
        userRole,
        signUp,
        signIn,
        signOut: signOutUser,
        resetPassword,
        updatePassword,
        resetUserState,
        loading: loading,
      }}
    >
      {children}
    </ClerkAuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(ClerkAuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within a ClerkAuthProvider");
  }
  
  return context;
}
