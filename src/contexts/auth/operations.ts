
import { supabase } from "@/integrations/supabase/client";

// Create a type that matches what the operations functions expect
export interface ToastParams {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const signUpOperation = async (
  email: string, 
  password: string, 
  toastFn: (params: ToastParams) => void
) => {
  try {
    console.log("Attempting signup for:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      }
    });

    if (error) throw error;
    
    console.log("Signup successful:", data);
    toastFn({
      title: "Account created!",
      description: "Please check your email for verification."
    });
    
    return { data };
  } catch (error: any) {
    console.error("Signup error:", error.message);
    toastFn({
      title: "Signup Error",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
};

export const signInOperation = async (
  email: string, 
  password: string, 
  toastFn: (params: ToastParams) => void
) => {
  try {
    console.log("Attempting signin for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    console.log("Signin successful:", data.user?.id);
    return { data };
  } catch (error: any) {
    console.error("Signin error:", error.message);
    toastFn({
      title: "Sign In Error",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
};

export const signOutOperation = async (toastFn: (params: ToastParams) => void) => {
  try {
    console.log("Attempting signout");
    const { error } = await supabase.auth.signOut({
      scope: 'global'  // Sign out from all devices
    });
    
    if (error) throw error;
    
    console.log("Signout successful");
    return { success: true };
  } catch (error: any) {
    console.error("Signout error:", error.message);
    toastFn({
      title: "Sign Out Error",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
};

export const resetPasswordOperation = async (
  email: string, 
  toastFn: (params: ToastParams) => void
) => {
  try {
    console.log("Attempting password reset for:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    console.log("Password reset email sent");
    toastFn({
      title: "Password Reset Email Sent",
      description: "Please check your inbox for instructions."
    });
    return { success: true };
  } catch (error: any) {
    console.error("Password reset error:", error.message);
    toastFn({
      title: "Password Reset Error",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
};

export const updatePasswordOperation = async (
  newPassword: string, 
  toastFn: (params: ToastParams) => void
) => {
  try {
    console.log("Attempting to update password");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    
    console.log("Password updated successfully");
    toastFn({
      title: "Password Updated",
      description: "Your password has been successfully updated."
    });
    return { success: true };
  } catch (error: any) {
    console.error("Update password error:", error.message);
    toastFn({
      title: "Password Update Error",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
};
