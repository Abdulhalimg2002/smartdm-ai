
"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";

import api from "@/lib/api/axios";

const PUBLIC_AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/google",
  "/auth/me",
];

export default function AuthSessionManager() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const isHandlingUnauthorized = useRef(false);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => {
        // Allow another session-expiration redirect
        // after a successful login.
        if (response.config.url?.includes("/auth/login")) {
          isHandlingUnauthorized.current = false;
        }

        return response;
      },
      (error: unknown) => {
        if (
          !axios.isAxiosError(error) ||
          error.response?.status !== 401
        ) {
          return Promise.reject(error);
        }

        const requestUrl = error.config?.url ?? "";

        const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some(
          (endpoint) => requestUrl.includes(endpoint),
        );

        if (
          !isPublicAuthRequest &&
          !isHandlingUnauthorized.current
        ) {
          isHandlingUnauthorized.current = true;

          // Remove cached data so another user's data
          // cannot remain visible after session expiration.
          queryClient.clear();

          router.replace("/login");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [queryClient, router]);

  return null;
}
