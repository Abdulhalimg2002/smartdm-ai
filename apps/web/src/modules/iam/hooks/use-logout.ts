
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";

import { authService } from "../services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: async () => {
      // Stop ongoing queries before clearing cached data.
      await queryClient.cancelQueries();

      // Remove cached user and application data.
      queryClient.clear();

      // Return to the localized login page.
      router.replace("/login");
    },
  });
}
