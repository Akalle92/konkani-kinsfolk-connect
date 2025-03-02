
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  user: any;
  loading: boolean;
  isSigningOut: boolean;
  handleSignOut: () => Promise<void>;
}

const AuthButtons = ({ 
  user, 
  loading, 
  isSigningOut, 
  handleSignOut 
}: AuthButtonsProps) => {
  if (loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <>
        <span className="text-sm text-muted-foreground mr-2">
          {user.email?.split('@')[0]}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {isSigningOut ? "Signing out..." : "Logout"}
        </Button>
      </>
    );
  }

  return (
    <Button asChild size="sm">
      <Link to="/auth">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Link>
    </Button>
  );
};

export default AuthButtons;
