
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ResetPasswordSuccess = () => {
  return (
    <div className="text-center space-y-4">
      <Alert className="mb-6 bg-green-50 border-green-200">
        <AlertDescription>
          Your password has been successfully updated. You will be redirected to the main page.
        </AlertDescription>
      </Alert>
      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
    </div>
  );
};

export default ResetPasswordSuccess;
