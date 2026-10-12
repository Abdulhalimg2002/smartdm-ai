
"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import type { ResetPasswordRequest } from "../types/auth.type";

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      authService.resetPassword(data),
  });
}
