import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signOut } from '@/features/auth/api/auth';

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Prevent the next account that signs in on this device from seeing a
      // previous account's cached profile/data for an instant.
      queryClient.clear();
    },
  });
}
