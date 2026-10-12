
"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import type { ForgotPasswordRequest } from "../types/auth.type";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });
}
