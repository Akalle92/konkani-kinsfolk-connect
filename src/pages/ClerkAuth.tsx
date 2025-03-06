
import React, { useEffect } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const ClerkAuth = () => {
  const navigate = useNavigate();
  const { userId, isLoaded } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Check if we should redirect to a stored path after login
  useEffect(() => {
    if (isLoaded && userId) {
      // User is already signed in, redirect to stored path or dashboard
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      
      // Clear the stored path
      sessionStorage.removeItem('redirectAfterLogin');
      
      toast.success("Signed in successfully", {
        description: "Welcome back!",
      });
      
      navigate(redirectPath);
    }
  }, [userId, isLoaded, navigate]);

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {isLogin ? (
            <>
              <SignIn 
                signUpUrl="/auth?sign-up=true"
                redirectUrl="/dashboard"
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    card: "shadow-none",
                    rootBox: "w-full",
                    header: "text-2xl font-bold text-center mb-6",
                    footer: {
                      base: "text-sm text-muted-foreground text-center mt-6"
                    }
                  }
                }}
              />
              <div className="text-sm text-muted-foreground text-center mt-6">
                Don't have an account?{" "}
                <button className="text-primary hover:underline" onClick={toggleView}>
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              <SignUp 
                signInUrl="/auth"
                redirectUrl="/dashboard"
                afterSignUpUrl="/dashboard"
                appearance={{
                  elements: {
                    card: "shadow-none",
                    rootBox: "w-full",
                    header: "text-2xl font-bold text-center mb-6",
                    footer: {
                      base: "text-sm text-muted-foreground text-center mt-6"
                    }
                  }
                }}
              />
              <div className="text-sm text-muted-foreground text-center mt-6">
                Already have an account?{" "}
                <button className="text-primary hover:underline" onClick={toggleView}>
                  Sign In
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkAuth;
