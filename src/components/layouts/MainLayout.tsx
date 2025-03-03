
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/hooks";
import MainNavigation from "./MainNavigation";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only redirect after auth state is confirmed (not during loading)
    if (!loading) {
      if (!user) {
        console.log("MainLayout: No user found, redirecting to auth");
        navigate('/auth');
        toast("Authentication required", {
          description: "Please sign in to access this page",
        });
      }
      setAuthChecked(true);
    }
  }, [user, navigate, loading]);

  // Don't render anything while checking auth status
  if (!authChecked && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render the content after auth check, and only if user is authenticated
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      <main className="flex-1">
        {user && children}
      </main>
    </div>
  );
};

export default MainLayout;
