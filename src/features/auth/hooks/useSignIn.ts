import { useMutation } from '@tanstack/react-query';

import { signIn } from '@/features/auth/api/auth';

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  });
}
