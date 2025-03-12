
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import MainNavigation from "./MainNavigation";
import { toast } from "sonner";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only run the auth check when auth is not loading anymore
    if (isLoaded) {
      setAuthChecked(true);

      // For public routes, we don't need to redirect
      const isPublicRoute = location.pathname === '/auth' || location.pathname === '/';
      
      if (!userId && !isPublicRoute) {
        console.log("MainLayout: No user found, redirecting to auth", location.pathname);
        
        // Store the current path to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        
        // Navigate to auth
        navigate('/auth');
        
        toast.error("Authentication required", {
          description: "Please sign in to access this page",
        });
      } else {
        console.log("MainLayout: User authenticated or on public route", userId);
      }
    }
  }, [userId, navigate, isLoaded, location.pathname]);

  // Show loading spinner while checking auth
  if (!isLoaded) {
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

  // Use Outlet to render the nested routes
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
