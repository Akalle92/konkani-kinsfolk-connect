
import { Loader2 } from "lucide-react";

const ResetPasswordLoading = () => {
  return (
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="mt-4 text-muted-foreground">Verifying your reset link...</p>
    </div>
  );
};

export default ResetPasswordLoading;
