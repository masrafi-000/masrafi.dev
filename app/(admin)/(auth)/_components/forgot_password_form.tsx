"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldAlert } from "lucide-react";

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
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/validators/auth.zod";



export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setServerError(null);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "forget-password",
      });

      if (error) {
        const errorMsg = error.message || "Failed to send verification OTP code.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("OTP verification code sent to your email!");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
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
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="gap-6">
                <div className="flex flex-col items-start gap-1 text-left">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Forgot Password
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your admin email address to receive an OTP verification code.
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

                <Field className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-semibold shadow-md transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 mr-2" /> Send OTP Code
                      </>
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
          </div>

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
                OTP Password Reset
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An OTP (One-Time Password) verification code will be dispatched to your account email to verify your identity.
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
