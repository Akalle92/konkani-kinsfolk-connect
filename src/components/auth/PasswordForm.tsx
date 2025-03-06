
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface PasswordFormProps {
  onSubmit: (password: string) => Promise<void>;
  loading: boolean;
}

const PasswordForm = ({ onSubmit, loading }: PasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setValidationErrors([]);
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setValidationErrors(passwordErrors);
      return;
    }
    
    try {
      await onSubmit(password);
    } catch (error) {
      console.error("Update password error:", error);
      const message = error instanceof Error ? error.message : "An error occurred";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <div>
            <p className="font-semibold mb-2">Password requirements:</p>
            <ul className="list-disc pl-5">
              {validationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
        </p>
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
          className="w-full"
          autoComplete="new-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
};

export default PasswordForm;
