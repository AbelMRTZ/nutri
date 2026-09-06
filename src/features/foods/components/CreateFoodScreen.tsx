import { useRouter } from 'expo-router';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { FoodForm } from '@/features/foods/components/FoodForm';
import { useCreateFood } from '@/features/foods/hooks/useCreateFood';
import type { FoodFormValues } from '@/features/foods/schema';

export function CreateFoodScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const createFood = useCreateFood(userId);

  function handleSubmit(values: FoodFormValues) {
    createFood.mutate(values, {
      onSuccess: () => router.back(),
    });
  }

  return (
    <Screen scroll>
      <FoodForm
        defaultValues={{}}
        onSubmit={handleSubmit}
        submitting={createFood.isPending}
        submitLabel="Añadir alimento"
      />
    </Screen>
  );
}
