
import React from "react";
import MainNavigation from "./MainNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
