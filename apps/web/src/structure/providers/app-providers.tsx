
"use client";

import type { ReactNode } from "react";

import QueryProvider from "./query-provider";
import AuthSessionManager from "./auth-session-manager";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return <QueryProvider>
      <AuthSessionManager />
    {children}</QueryProvider>;
}
