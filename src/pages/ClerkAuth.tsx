
import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ClerkAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);

  const handleSignInComplete = () => {
    toast({
      title: "Signed in successfully",
      description: "Welcome back!",
    });
    
    // Get the stored redirect path or default to dashboard
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
    
    // Clear the stored path
    sessionStorage.removeItem('redirectAfterLogin');
    
    navigate(redirectPath);
  };

  const handleSignUpComplete = () => {
    toast({
      title: "Account created",
      description: "Welcome to the app!",
    });
    navigate("/dashboard");
  };

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
                afterSignIn={handleSignInComplete}
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
                afterSignUp={handleSignUpComplete}
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
