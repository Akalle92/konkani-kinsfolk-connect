
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user && !loading && !redirecting) {
      setRedirecting(true);
      
      // Get the stored redirect path or default to dashboard
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      
      // Clear the stored path
      sessionStorage.removeItem('redirectAfterLogin');
      
      console.log("Auth: User is logged in, redirecting to", redirectPath);
      
      // Use a small timeout to ensure state updates have propagated
      setTimeout(() => {
        navigate(redirectPath);
      }, 100);
    }
  }, [user, loading, navigate, redirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  disabled={loading || redirecting}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  disabled={loading || redirecting}
                />
              </div>
              <Button disabled={loading || redirecting} type="submit">
                {loading || redirecting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>{isLogin ? "Signing in..." : "Signing up..."}</span>
                  </div>
                ) : (
                  isLogin ? "Sign In" : "Sign Up"
                )}
              </Button>
            </div>
          </form>
          <div className="text-sm text-muted-foreground text-center">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <Button variant="link" onClick={() => setIsLogin(false)}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="link" onClick={() => setIsLogin(true)}>
                  Sign In
                </Button>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <Button variant="link" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
