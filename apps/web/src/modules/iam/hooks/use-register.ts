
"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import { RegisterRequest } from "../types/auth.type";


export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      authService.register(data),
  });
}
