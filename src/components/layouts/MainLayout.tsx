
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
    // Only redirect after auth state is confirmed (not during loading)
    if (!loading) {
      setAuthChecked(true);
      
      if (!user) {
        console.log("MainLayout: No user found, redirecting to auth", location.pathname);
        
        // Store the current path to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        
        navigate('/auth');
        toast("Authentication required", {
          description: "Please sign in to access this page",
        });
      } else {
        console.log("MainLayout: User authenticated", user.id);
      }
    }
  }, [user, navigate, loading, location.pathname]);

  // Don't render anything while checking auth status
  if (loading || (!user && !authChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show main layout when authentication check is done and we have a user
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
