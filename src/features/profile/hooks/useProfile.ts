import { useQuery } from '@tanstack/react-query';

import { getProfile } from '@/features/profile/api/profile';

export const profileQueryKey = (userId: string | undefined) => ['profile', userId] as const;

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileQueryKey(userId),
    queryFn: () => getProfile(userId as string),
    enabled: !!userId,
  });
}
