
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to /trees");
      navigate("/trees");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Clear previous errors
    setError("");

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/trees");
      } else {
        await signUp(email, password);
        toast({
          title: "Account created!",
          description: "Please check your email for verification.",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      const message = error instanceof Error ? error.message : "An error occurred";
      let userFriendlyMessage = message;
      
      if (message.includes("Invalid login credentials")) {
        userFriendlyMessage = "Invalid email or password. Please try again.";
      } else if (message.includes("User already registered")) {
        userFriendlyMessage = "This email is already registered. Please try logging in instead.";
      } else if (message.includes("Email not confirmed")) {
        userFriendlyMessage = "Please check your email for a confirmation link.";
      } else if (message.includes("rate limit")) {
        userFriendlyMessage = "Too many attempts. Please try again later.";
      }
      
      setError(userFriendlyMessage);
    }
  };

  // If still checking auth status, show loading
  if (loading && !error) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-playfair font-bold text-center mb-8 text-primary">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          
          {isLogin && (
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Signing In..." : "Signing Up..."}
              </>
            ) : (
              isLogin ? "Sign In" : "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setEmail("");
              setPassword("");
            }}
            className="text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
