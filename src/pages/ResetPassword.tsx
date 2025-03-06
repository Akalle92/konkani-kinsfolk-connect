
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PasswordForm from "@/components/auth/PasswordForm";
import ResetPasswordError from "@/components/auth/ResetPasswordError";
import ResetPasswordSuccess from "@/components/auth/ResetPasswordSuccess";

const ResetPassword = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { updatePassword, user, loading } = useAuth();
  const navigate = useNavigate();

  // We can only reset password if we have a user (which means the reset link was valid)
  useEffect(() => {
    // If no user is logged in after loading, this means the reset link was invalid or expired
    if (!loading && !user) {
      setError("Invalid or expired password reset link. Please request a new one.");
    }
  }, [user, loading]);

  const handleUpdatePassword = async (password: string) => {
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
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive"
      });
    }
  };

  // If still checking auth status, show loading
  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

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
          <ResetPasswordSuccess />
        ) : (
          <>
            {user ? (
              <PasswordForm 
                onSubmit={handleUpdatePassword}
                loading={loading}
              />
            ) : (
              <ResetPasswordError />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
