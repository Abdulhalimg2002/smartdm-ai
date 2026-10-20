
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useGoogleAuth } from "../hooks/use-google-auth";
import { useLogin } from "../hooks/use-login";
import { loginForm } from "../data";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login.schema";
import { useTranslations } from "next-intl";

type LoginFormProps = React.ComponentProps<"form">;

export function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const loginMutation = useLogin();
  const googleAuthMutation = useGoogleAuth();
  const router = useRouter();
 const t = useTranslations();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      await loginMutation.mutateAsync(values);

      router.replace("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(
          error,
          "Unable to sign in. Please check your email and password.",
        ),
      );

    
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("mx-auto flex w-full flex-col gap-5 sm:gap-6", className)}
      {...props}
    >
      <FieldGroup className="gap-4 sm:gap-5">
        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            SmartDM AI

          </h1>
          <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">
           {t("auth.welcomeBack")}
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter your email below to login to your account.
          </p>

          {serverError && (
            <FieldDescription className="text-center text-destructive">
              {serverError}
            </FieldDescription>
          )}
        </div>

        {/* Credentials */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {loginForm.map((field) => (
            <Field key={field.name} className="gap-2">
              <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                {field.name}
              </FieldLabel>

              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={
                  field.name === "email" ? "email" : "current-password"
                }
                className="h-11 rounded-(--radius-input) text-sm"
                {...register(field.name)}
              />

              {errors[field.name] && (
                <FieldDescription className="text-destructive">
                  {errors[field.name]?.message}
                </FieldDescription>
              )}
            </Field>
          ))}
        </div>

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="font-medium text-foreground  underline-offset-4 hover:text-primary   "
          >
            Forgot your password?
          </Link>
        </div>

        {/* Login */}
        <Button
          type="submit"
          className="h-11 w-full rounded-(--radius-button) text-sm font-medium"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Google login */}
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            type="button"
            className="h-11 w-full rounded-(--radius-button) text-sm"
            disabled={googleAuthMutation.isPending}
            onClick={() => googleAuthMutation.mutate()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 shrink-0"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>

            {googleAuthMutation.isPending
              ? "Redirecting to Google..."
              : "Login with Google"}
          </Button>

          <FieldDescription className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign up
            </Link>
          </FieldDescription>
        </div>
      </FieldGroup>
    </form>
  );
}
