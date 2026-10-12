
"use client";

import type { ReactNode } from "react";

import QueryProvider from "./query-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
