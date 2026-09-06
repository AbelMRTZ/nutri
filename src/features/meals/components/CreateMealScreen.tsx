import { useRouter } from 'expo-router';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { MealForm } from '@/features/meals/components/MealForm';
import { useCreateMeal } from '@/features/meals/hooks/useCreateMeal';
import type { MealFormValues } from '@/features/meals/schema';

export function CreateMealScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const createMeal = useCreateMeal(userId);

  function handleSubmit(values: MealFormValues) {
    createMeal.mutate(values, {
      // A freshly created meal has no foods yet — the next step is always
      // adding some, so we replace (not push) into its detail screen.
      onSuccess: (meal) => router.replace(`/(app)/(tabs)/despensa/comidas/${meal.id}`),
    });
  }

  return (
    <Screen scroll>
      <MealForm defaultValues={{}} onSubmit={handleSubmit} submitting={createMeal.isPending} submitLabel="Crear comida" />
    </Screen>
  );
}
