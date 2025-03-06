
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ResetPasswordErrorProps {
  message?: string;
}

const ResetPasswordError = ({ message = "The password reset link is invalid or has expired. Please request a new password reset link." }: ResetPasswordErrorProps) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">
        {message}
      </p>
      <Link to="/forgot-password">
        <Button className="mt-4">Request New Reset Link</Button>
      </Link>
    </div>
  );
};

export default ResetPasswordError;
