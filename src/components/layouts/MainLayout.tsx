
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainNavigation from "./MainNavigation";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("MainLayout: No user found, redirecting to auth");
      navigate('/auth');
      toast("Authentication required", {
        description: "Please sign in to access this page",
      });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
