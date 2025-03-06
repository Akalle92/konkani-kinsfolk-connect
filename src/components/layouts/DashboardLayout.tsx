
import { ReactNode, useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/contexts/auth/hooks";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Check if it's user's first time
  useEffect(() => {
    if (user) {
      const hasVisitedBefore = localStorage.getItem(`dashboard-visited-${user.id}`);
      
      if (!hasVisitedBefore) {
        setIsFirstTimeUser(true);
        localStorage.setItem(`dashboard-visited-${user.id}`, 'true');
      }
    }
  }, [user]);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu trigger */}
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
      
      {/* Sidebar - hidden on mobile, shown on desktop */}
      <div className={`
        fixed inset-0 z-40 lg:relative lg:z-0 lg:flex
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <DashboardSidebar />
        
        {/* Backdrop for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
