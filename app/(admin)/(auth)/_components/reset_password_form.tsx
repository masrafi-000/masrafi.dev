"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, Lock, Mail, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/authClient";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/validators/auth.zod";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialOtp = searchParams.get("otp") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setServerError(null);

    if (!email || !otp) {
      const msg = "Missing email or OTP verification code. Please request a new OTP.";
      setServerError(msg);
      toast.error(msg);
      return;
    }

    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password: data.password,
      });

      if (error) {
        const errorMsg = error.message || "Failed to reset password. OTP code might be expired.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Password reset successfully! Please log in.");
      router.push("/admin-login");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-4xl mx-auto", className)}
      {...props}
    >
      <Card className="overflow-hidden border border-border/40 shadow-2xl bg-card/80 backdrop-blur-xl">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-10 flex flex-col justify-center"
          >
            <FieldGroup className="gap-5">
              <div className="flex flex-col items-start gap-1 text-left">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Reset Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your new password below to reset your admin account credentials.
                </p>
              </div>

              {serverError && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {!initialEmail && (
                <Field orientation="vertical">
                  <FieldLabel htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </Field>
              )}

              {!initialOtp && (
                <Field orientation="vertical">
                  <FieldLabel htmlFor="otp" className="text-sm font-medium">
                    OTP Code
                  </FieldLabel>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-9 font-mono tracking-widest text-base"
                    />
                  </div>
                </Field>
              )}

              <Field orientation="vertical">
                <FieldLabel htmlFor="password" className="text-sm font-medium">
                  New Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pl-9 pr-10"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password?.message && (
                  <FieldError errors={[{ message: errors.password.message }]} />
                )}
              </Field>

              <Field orientation="vertical">
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pl-9 pr-10"
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <FieldError
                    errors={[{ message: errors.confirmPassword.message }]}
                  />
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold shadow-md transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Remember your password?{" "}
                <Link href="/admin-login" className="text-primary font-medium hover:underline">
                  Sign In
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-linear-to-br from-primary/10 via-muted/50 to-primary/20 md:flex flex-col justify-between p-10 border-l border-border/40 overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-xl font-bold tracking-tight text-primary">
                Masrafi.dev
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Set New Credentials
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose a strong password with letters, numbers, and symbols for enhanced account security.
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-border/20">
              <p className="text-xs text-muted-foreground">
                Protected system area. Authorized personnel only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
