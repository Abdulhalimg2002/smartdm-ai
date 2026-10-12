
"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import { LoginRequest } from "../types/auth.type";


export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      authService.login(data),
  });
}
