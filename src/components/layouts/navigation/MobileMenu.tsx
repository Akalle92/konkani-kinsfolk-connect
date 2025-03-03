
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "./types";

interface MobileMenuProps {
  isMenuOpen: boolean;
  navItems: NavItem[];
  isActive: (path: string) => boolean;
  closeMenu: () => void;
  user: any;
  loading: boolean;
  isSigningOut: boolean;
  handleSignOut: () => Promise<void>;
}

const MobileMenu = ({
  isMenuOpen,
  navItems,
  isActive,
  closeMenu,
  user,
  loading,
  isSigningOut,
  handleSignOut
}: MobileMenuProps) => {
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
            <Link to={item.path} className="flex items-center">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
        
        {loading ? (
          <div className="flex items-center py-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : user ? (
          <Button 
            variant="outline" 
            className="w-full justify-start mt-4"
            onClick={() => {
              handleSignOut();
              closeMenu();
            }}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing out...</span>
              </span>
            ) : (
              <span className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </span>
            )}
          </Button>
        ) : (
          <Button 
            asChild 
            className="w-full justify-start mt-4"
            onClick={closeMenu}
          >
            <Link to="/auth" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Login</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
