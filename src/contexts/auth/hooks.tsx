
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

export function useAuth() {
  const context = useContext(AuthContext);
  const clerkAuth = useClerkAuth();
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Map Clerk auth information to our custom auth context format
  return {
    ...context,
    // Override user and loading with Clerk's values
    user: clerkAuth.userId ? {
      id: clerkAuth.userId,
      email: clerkAuth.user?.primaryEmailAddress?.emailAddress
    } : null,
    loading: !clerkAuth.isLoaded,
    isLoaded: clerkAuth.isLoaded,
    userId: clerkAuth.userId
  };
}
