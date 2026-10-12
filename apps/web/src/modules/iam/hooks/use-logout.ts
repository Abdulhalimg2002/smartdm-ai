
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ["auth"] });
      queryClient.clear();
    },
  });
}
