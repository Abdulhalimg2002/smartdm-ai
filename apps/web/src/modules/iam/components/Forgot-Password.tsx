
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { getApiErrorMessage } from "@/lib/api/api-error";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/modules/iam/schemas/forgot-password.schema";
import { useForgotPassword } from "@/modules/iam/hooks/use-forgot-password";

export function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const forgotPasswordMutation = useForgotPassword();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
   
    mode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await forgotPasswordMutation.mutateAsync(values);
      setSuccessMessage(
        "If an account exists with this email, you will receive a password reset link.",
      );
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(
          error,
          "Unable to send the reset link. Please try again.",
        ),
      );
      reset();
    }
   
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email and we’ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                   className="h-11 rounded-(--radius-input) text-sm"
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {serverError && (
                <FieldDescription className="text-destructive">
                  {serverError}
                </FieldDescription>
              )}

              {successMessage && (
                <FieldDescription role="status">
                  {successMessage}
                </FieldDescription>
              )}

              <Field>
                <Button
               className="h-11 w-full"
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}

                >
                  {forgotPasswordMutation.isPending
                    ? "Sending..."
                    : "Send Reset Link"}
                </Button>

                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className=" text-foreground underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
