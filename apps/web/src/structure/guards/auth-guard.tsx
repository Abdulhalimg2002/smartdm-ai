
"use client";

import { useEffect } from "react";
import { isAxiosError } from "axios";
import { useRouter } from "@/i18n/navigation";
import { useMe } from "@/modules/iam/hooks/use-me";
import { Button } from "@/components/ui/button";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const {
    isPending,
    isError,
    error,
    refetch,
  } = useMe();

  const isUnauthorized =
    isAxiosError(error) &&
    error.response?.status === 401;

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/login");
    }
  }, [isUnauthorized, router]);

  if (isPending || isUnauthorized) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-svh items-center justify-center"
      >
        {isUnauthorized
          ? "Redirecting to login..."
          : "Checking your session..."}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          Unable to verify your session. Please try again.
        </p>

        <Button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Try again
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
