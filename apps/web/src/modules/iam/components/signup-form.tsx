
"use client";

import { useState } from "react";
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
import { getApiErrorMessage } from "@/lib/api/api-error";

import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema";
import { useRegister } from "../hooks/use-register";
import { signupForm } from "../data";
import { useGoogleAuth } from "../hooks/use-google-auth";

type SignupFormProps = React.ComponentProps<"form">;

export function SignupForm({
  className,
  ...props
}: SignupFormProps) {
  const registerMutation = useRegister();
  const googleAuthMutation = useGoogleAuth();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);

    try {
      await registerMutation.mutateAsync(values);
      router.replace("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(
          error,
          "Unable to create your account. Please try again.",
        ),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {/* Heading */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="text-sm text-muted-foreground">
            Fill in the form below to create your account.
          </p>

          {serverError && (
            <FieldDescription
              role="alert"
              className="text-destructive"
            >
              {serverError}
            </FieldDescription>
          )}
        </div>

        {/* Form Fields */}
        {signupForm.map((field) => (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>
              {field.label}
            </FieldLabel>

           <Input
  id={field.name}
  type={field.type}
  placeholder={field.placeholder}
  autoComplete={
    field.name === "email"
      ? "email"
      : field.name === "password"
        ? "new-password"
        : field.name === "firstName"
          ? "given-name"
          : field.name === "lastName"
            ? "family-name"
            : "off"
  }
  aria-invalid={!!errors[field.name]}
  {...register(field.name)}
  className="h-11 rounded-(--radius-input) text-sm"
/>

            {errors[field.name] && (
              <FieldDescription className="text-destructive">
                {errors[field.name]?.message}
              </FieldDescription>
            )}
          </Field>
        ))}

        {/* Create Account */}
        <Field>
          <Button
            type="submit"
            className="h-11 w-full"
            disabled={
              registerMutation.isPending ||
              googleAuthMutation.isPending
            }
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Google Authentication */}
        <Field>
          <Button
            variant="outline"
            type="button"
            className="h-11 w-full"
            disabled={
              googleAuthMutation.isPending ||
              registerMutation.isPending
            }
            onClick={() => googleAuthMutation.mutate()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>

            {googleAuthMutation.isPending
              ? "Redirecting to Google..."
              : "Continue with Google"}
          </Button>

          <FieldDescription className="px-2 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
