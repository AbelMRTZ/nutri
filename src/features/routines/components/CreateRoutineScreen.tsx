import { useRouter } from 'expo-router';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { RoutineForm } from '@/features/routines/components/RoutineForm';
import { useCreateRoutine } from '@/features/routines/hooks/useCreateRoutine';
import type { RoutineFormValues } from '@/features/routines/schema';

export function CreateRoutineScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const createRoutine = useCreateRoutine(userId);

  function handleSubmit(values: RoutineFormValues) {
    createRoutine.mutate(values, {
      // A freshly created routine has no exercises yet — the next step is
      // always adding some, so we replace (not push) into its detail screen.
      onSuccess: (routine) => router.replace(`/(app)/(tabs)/entrenamiento/rutinas/${routine.id}`),
    });
  }

  return (
    <Screen scroll>
      <RoutineForm defaultValues={{}} onSubmit={handleSubmit} submitting={createRoutine.isPending} submitLabel="Crear rutina" />
    </Screen>
  );
}
