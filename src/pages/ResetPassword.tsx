
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();

  // We can only reset password if we have a user (which means the reset link was valid)
  useEffect(() => {
    // If no user is logged in, this means the reset link was invalid or expired
    if (!user && !loading) {
      setError("Invalid or expired password reset link. Please try again.");
    }
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      await updatePassword(password);
      setSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      // Redirect to main page after a short delay
      setTimeout(() => {
        navigate("/trees");
      }, 2000);
    } catch (error) {
      console.error("Update password error:", error);
      const message = error instanceof Error ? error.message : "An error occurred";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-playfair font-bold text-center mb-8 text-primary">
          Create New Password
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
                Your password has been successfully updated. You will be redirected to the main page.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  The password reset link is invalid or has expired. Please request a new password reset link.
                </p>
                <Link to="/forgot-password">
                  <Button className="mt-4">Request New Reset Link</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
