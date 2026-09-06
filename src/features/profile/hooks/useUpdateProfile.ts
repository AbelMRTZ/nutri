import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProfile, type ProfileUpdate } from '@/features/profile/api/profile';
import { profileQueryKey } from '@/features/profile/hooks/useProfile';

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: ProfileUpdate) => updateProfile(userId as string, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(profileQueryKey(userId), data);
    },
  });
}
