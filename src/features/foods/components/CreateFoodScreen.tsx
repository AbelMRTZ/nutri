import { useRouter } from 'expo-router';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { FoodForm } from '@/features/foods/components/FoodForm';
import { useCreateFood } from '@/features/foods/hooks/useCreateFood';
import type { FoodFormValues } from '@/features/foods/schema';

export type CreateFoodScreenProps = {
  defaultValues?: Partial<FoodFormValues>;
  sourceBarcode?: string;
};

export function CreateFoodScreen({ defaultValues, sourceBarcode }: CreateFoodScreenProps = {}) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const createFood = useCreateFood(userId);

  function handleSubmit(values: FoodFormValues) {
    createFood.mutate(
      { ...values, ...(sourceBarcode ? { source_barcode: sourceBarcode } : {}) },
      { onSuccess: () => router.back() },
    );
  }

  return (
    <Screen scroll>
      <FoodForm
        defaultValues={defaultValues ?? {}}
        onSubmit={handleSubmit}
        submitting={createFood.isPending}
        submitLabel="Añadir alimento"
      />
    </Screen>
  );
}
