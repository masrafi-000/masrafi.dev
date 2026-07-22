import { Suspense } from "react";
import { ForgotPasswordForm } from "../_components/forgot_password_form";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="absolute top-6 right-6 z-10">
        <ToggleTheme animationType="circle-spread" className="scale-90" />
      </div>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
