"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldAlert } from "lucide-react";

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
import Link from "next/link";
import { loginSchema, type LoginSchema } from "@/validators/auth.zod";



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        const errorMsg = error.message || "Invalid email or password";
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Welcome back! Signed in successfully.");
      router.push("/dashboard");
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
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-start gap-1 text-left">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to access your admin dashboard
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
                  Email
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
                  <FieldLabel htmlFor="password" className="text-sm font-medium">
                    Password
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary underline-offset-4 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pl-9 pr-10"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold shadow-md transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-linear-to-br from-primary/10 via-muted/50 to-primary/20 md:flex flex-col justify-between p-10 border-l border-border/40 overflow-hidden">
            {/* Background Decorative Patterns */}
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-xl font-bold tracking-tight text-primary">
                Masrafi.dev
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Admin Control Center
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage your portfolio projects, view analytics, and control site
                features in real time.
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
        By continuing, you agree to the <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
