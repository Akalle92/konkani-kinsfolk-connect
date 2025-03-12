
import { ReactNode, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@clerk/clerk-react";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  useEffect(() => {
    if (isLoaded && !userId) {
      // Redirect to auth page if no user is logged in
      navigate('/auth');
      return;
    }
    
    if (userId) {
      const hasVisitedBefore = localStorage.getItem(`dashboard-visited-${userId}`);
      
      if (!hasVisitedBefore) {
        setIsFirstTimeUser(true);
        localStorage.setItem(`dashboard-visited-${userId}`, 'true');
      }
    }
  }, [userId, isLoaded, navigate]);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!userId) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-background border shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            {isMobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 12h16M4 6h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      <div className={`
        fixed inset-0 z-40 lg:relative lg:z-0 lg:flex
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <DashboardSidebar />
        
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
      
      <main className="flex-1 overflow-y-auto bg-background">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
