"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

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
import { verifyOtpSchema, type VerifyOtpSchema } from "@/validators/auth.zod";

export function VerifyOtpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: defaultEmail,
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyOtpSchema) => {
    setServerError(null);

    try {
      // Proceed to reset password page with email and OTP code
      toast.success("OTP entered! Now set your new password.");
      router.push(
        `/reset-password?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(data.otp)}`
      );
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleResendOtp = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      if (error) {
        toast.error(error.message || "Failed to resend OTP.");
        return;
      }

      toast.success("A new OTP code has been sent to your email!");
    } catch {
      toast.error("Failed to resend OTP code.");
    } finally {
      setIsResending(false);
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
                  Verify OTP Code
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter the OTP verification code sent to your email address.
                </p>
              </div>

              {serverError && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

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
                    autoComplete="email"
                    className="pl-9"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </div>
                {errors.email?.message && (
                  <FieldError errors={[{ message: errors.email.message }]} />
                )}
              </Field>

              <Field orientation="vertical">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="otp" className="text-sm font-medium">
                    OTP Verification Code
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-xs text-primary underline-offset-4 hover:underline font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={cn("w-3 h-3", isResending && "animate-spin")} />
                    Resend Code
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    className="pl-9 font-mono tracking-widest text-base"
                    aria-invalid={!!errors.otp}
                    {...register("otp")}
                  />
                </div>
                {errors.otp?.message && (
                  <FieldError errors={[{ message: errors.otp.message }]} />
                )}
              </Field>

              <Field className="flex flex-col gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold shadow-md transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying OTP...
                    </>
                  ) : (
                    "Verify OTP & Continue"
                  )}
                </Button>

                <Button asChild variant="ghost" className="w-full font-medium">
                  <Link href="/admin-login">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
                  </Link>
                </Button>
              </Field>
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
                OTP Verification
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter the passcode sent to your email to verify your identity before resetting your password.
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

      <FieldDescription className="px-6 text-center text-xs">
        Need assistance? Contact support at <a href="mailto:smmasrafi01@gmail.com">smmasrafi01@gmail.com</a>
      </FieldDescription>
    </div>
  );
}
