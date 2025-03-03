
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "./types";
import { useAuth } from "@/contexts/auth";

interface DesktopNavigationProps {
  navItems: NavItem[];
  isActive: (path: string) => boolean;
}

const DesktopNavigation = ({ navItems, isActive }: DesktopNavigationProps) => {
  const { user } = useAuth();
  
  // Filter navigation items based on authentication status
  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <div className="hidden md:flex md:items-center md:space-x-1">
      {filteredNavItems.map((item) => (
        <Button
          key={item.path}
          asChild
          variant={isActive(item.path) ? "default" : "ghost"}
          className={cn(
            "h-10",
            isActive(item.path) && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          <Link to={item.path}>
            <span className="flex items-center">
              {item.icon}
              <span>{item.label}</span>
            </span>
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default DesktopNavigation;
