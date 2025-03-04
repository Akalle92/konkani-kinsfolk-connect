
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setError("");
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for a password reset link.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      const message = error instanceof Error ? error.message : "An error occurred";
      setError(message);
      toast({
        title: "Error",
        description: "There was a problem sending the password reset email.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-playfair font-bold text-center mb-8 text-primary">
          Reset Password
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription>
                Password reset email sent. Please check your inbox (and spam folder) for instructions.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              If you don't see the email within a few minutes, please try again or contact support.
            </p>
            <Link to="/auth" className="text-primary hover:underline block mt-4">
              Return to login
            </Link>
          </div>
        ) : (
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
              <p className="text-sm text-muted-foreground">
                We'll send you a link to reset your password.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
            <div className="text-center">
              <Link to="/auth" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
