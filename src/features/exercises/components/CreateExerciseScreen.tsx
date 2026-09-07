import { useRouter } from 'expo-router';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { ExerciseForm } from '@/features/exercises/components/ExerciseForm';
import { useCreateExercise } from '@/features/exercises/hooks/useCreateExercise';
import type { ExerciseFormValues } from '@/features/exercises/schema';

export function CreateExerciseScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const createExercise = useCreateExercise(userId);

  function handleSubmit(values: ExerciseFormValues) {
    createExercise.mutate(values, {
      onSuccess: () => router.back(),
    });
  }

  return (
    <Screen scroll>
      <ExerciseForm
        defaultValues={{}}
        onSubmit={handleSubmit}
        submitting={createExercise.isPending}
        submitLabel="Añadir ejercicio"
      />
    </Screen>
  );
}
