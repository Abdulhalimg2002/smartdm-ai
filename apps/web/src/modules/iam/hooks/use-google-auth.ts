
"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export function useGoogleAuth() {
  return useMutation({
    mutationFn: () => authService.getGoogleAuthUrl(),

    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });
}