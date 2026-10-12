
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
import { Link } from "@/i18n/navigation";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login.schema";
import { useLogin } from "../hooks/use-login";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useGoogleAuth } from "../hooks/use-google-auth";
import { loginForm } from "../data";
import { getApiErrorMessage } from "@/lib/api/api-error";

type LoginFormProps = React.ComponentProps<"form">;

export function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const loginMutation = useLogin();
  const googleAuthMutation = useGoogleAuth();
const router = useRouter();
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

    router.replace("/");
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
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            Login to your account
          </h1>
          {serverError && (
            <FieldDescription className="text-destructive">
              {serverError}
            </FieldDescription>
          )}
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account.
          </p>
        </div>

     
{loginForm.map((field) => (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <FieldDescription className="text-destructive">
                {errors[field.name]?.message}
              </FieldDescription>
            )}
          </Field>
        ))}
        <Link
          href="/forgot-password"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>

        <Field>
         <Button type="submit" disabled={loginMutation.isPending}>
  {loginMutation.isPending ? "Logging in..." : "Login"}
</Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button"  disabled={googleAuthMutation.isPending}
  onClick={() => googleAuthMutation.mutate()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
           {googleAuthMutation.isPending
    ? "Redirecting to Google..."
    : "Login with Google"}
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
