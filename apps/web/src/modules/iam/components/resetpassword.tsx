
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/navigation";
import { getApiErrorMessage } from "@/lib/api/api-error";

import { resetPasswordSchema } from "../schemas/reset-password.schema";
import type { ResetPasswordFormValues } from "../schemas/reset-password.schema";
import { useResetPassword } from "../hooks/use-reset-password";

export function Resetpassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [success, setSuccess] = useState(false);

  const resetPasswordMutation = useResetPassword();

const {
  register,
  handleSubmit,
  setError,
  formState: { errors, isSubmitting },
} = useForm<ResetPasswordFormValues>({
  resolver: zodResolver(resetPasswordSchema),
  defaultValues: {
    token,
    newPassword: "",
    confirmPassword: "",
  },
  mode: "onChange",
});

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.newPassword,
      });

      setSuccess(true);
    } catch (error) {
      setError("root", {
        type: "server",
        message: getApiErrorMessage(
          error,
          "Unable to reset your password. Please try again.",
        ),
      });
      
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Reset your password
          </CardTitle>

          <CardDescription>
            {success
              ? "Your password has been updated."
              : "Enter and confirm your new password below."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="flex flex-col gap-4">
              <p
                role="status"
                className="text-sm text-green-600"
              >
                Your password has been reset successfully.
              </p>

              <Button
                type="button"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Go to login
              </Button>
            </div>
          ) : (
            <form   onSubmit={handleSubmit( onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="newPassword">
                    New password
                  </FieldLabel>

                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.newPassword}
                    {...register("newPassword")}
                     className="h-11 rounded-(--radius-input) text-sm"
                  />

                  {errors.newPassword && (
                    <FieldDescription className="text-destructive">
                      {errors.newPassword.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm password
                  </FieldLabel>

                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                     className="h-11 rounded-(--radius-input) text-sm"
                  />

                  {errors.confirmPassword && (
                    <FieldDescription className="text-destructive">
                      {errors.confirmPassword.message}
                    </FieldDescription>
                  )}
                </Field>

                {errors.root?.message && (
                  <p
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.root.message}
                  </p>
                )}

                {!token && (
                  <p
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    The reset token is missing. Please open the
                    link from your email again.
                  </p>
                )}

                <Field>
                  <Button
                    type="submit"
                    className="h-11 w-full"

                    disabled={isSubmitting || !token}
                  >
                    {isSubmitting
                      ? "Resetting password..."
                      : "Reset password"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <Link href="/login">Sign in</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
