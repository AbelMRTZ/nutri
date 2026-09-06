import { useMutation } from '@tanstack/react-query';

import { signUp } from '@/features/auth/api/auth';

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}
