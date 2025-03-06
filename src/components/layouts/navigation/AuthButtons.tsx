
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/clerk-react";

interface AuthButtonsProps {
  loading?: boolean;
}

const AuthButtons = ({ loading }: AuthButtonsProps) => {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (userId) {
    return (
      <div className="flex items-center space-x-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <Button asChild size="sm">
      <Link to="/auth">
        <span className="flex items-center">
          <LogIn className="mr-2 h-4 w-4" />
          <span>Login</span>
        </span>
      </Link>
    </Button>
  );
};

export default AuthButtons;
