
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/hooks";
import MainNavigation from "./MainNavigation";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only run the auth check when auth is not loading anymore
    if (!loading) {
      setAuthChecked(true);
      
      if (!user) {
        console.log("MainLayout: No user found, redirecting to auth", location.pathname);
        
        // Store the current path to redirect back after login
        if (location.pathname !== '/auth' && location.pathname !== '/') {
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
        }
        
        // Use navigate instead of window.location for SPA routing
        navigate('/auth');
        
        // Only show toast if not on the auth page already
        if (location.pathname !== '/auth') {
          toast("Authentication required", {
            description: "Please sign in to access this page",
          });
        }
      } else {
        console.log("MainLayout: User authenticated", user.id);
      }
    }
  }, [user, navigate, loading, location.pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Do not render anything until auth check is complete
  if (!authChecked) {
    return null;
  }

  // Only render children when authenticated
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      <main className="flex-1">
        {user ? children : null}
      </main>
    </div>
  );
};

export default MainLayout;
