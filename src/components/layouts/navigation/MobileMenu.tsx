
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "./types";
import { useAuth, UserButton } from "@clerk/clerk-react";

interface MobileMenuProps {
  isMenuOpen: boolean;
  navItems: NavItem[];
  isActive: (path: string) => boolean;
  closeMenu: () => void;
}

const MobileMenu = ({
  isMenuOpen,
  navItems,
  isActive,
  closeMenu
}: MobileMenuProps) => {
  const { userId, isLoaded } = useAuth();
  
  if (!isMenuOpen) return null;
  
  return (
    <div className="md:hidden border-t border-border">
      <div className="container mx-auto px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            asChild
            variant={isActive(item.path) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActive(item.path) && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            onClick={closeMenu}
          >
            <Link to={item.path}>
              <span className="flex items-center w-full">
                {item.icon}
                <span>{item.label}</span>
              </span>
            </Link>
          </Button>
        ))}
        
        {!isLoaded ? (
          <div className="flex items-center py-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : userId ? (
          <div className="flex justify-center mt-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <Button 
            asChild 
            className="w-full justify-start mt-4"
            onClick={closeMenu}
          >
            <Link to="/auth">
              <span className="flex items-center w-full">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Login</span>
              </span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
