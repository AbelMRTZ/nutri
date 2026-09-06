import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { FoodForm } from '@/features/foods/components/FoodForm';
import { useDeleteFood } from '@/features/foods/hooks/useDeleteFood';
import { useFood } from '@/features/foods/hooks/useFood';
import { useUpdateFood } from '@/features/foods/hooks/useUpdateFood';
import { toFormDefaults } from '@/features/foods/mappers';
import type { FoodFormValues } from '@/features/foods/schema';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';

export type EditFoodScreenProps = {
  id: string;
};

export function EditFoodScreen({ id }: EditFoodScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: food, isLoading } = useFood(id);
  const updateFood = useUpdateFood(id, userId);
  const deleteFood = useDeleteFood(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();

  if (isLoading || !food) {
    return <FullScreenSpinner />;
  }

  function handleSubmit(values: FoodFormValues) {
    updateFood.mutate(values, {
      onSuccess: () => router.back(),
    });
  }

  function handleDelete() {
    deleteFood.mutate(id, {
      onSuccess: () => router.back(),
      onError: (error) => {
        setDeleteError(
          friendlyDeleteErrorMessage(error, 'Este alimento está en uso en una comida y no se puede eliminar.'),
        );
        setConfirmVisible(false);
      },
    });
  }

  return (
    <Screen scroll>
      <FoodForm
        defaultValues={toFormDefaults(food)}
        onSubmit={handleSubmit}
        submitting={updateFood.isPending}
        submitLabel="Guardar cambios"
        footer={
          <>
            {deleteError ? (
              <ThemedText type="small" themeColor="danger">
                {deleteError}
              </ThemedText>
            ) : null}
            <Button variant="ghost" title="Eliminar alimento" onPress={() => setConfirmVisible(true)} />
          </>
        }
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar alimento"
        description={`¿Seguro que quieres eliminar "${food.name}"? Esta acción no se puede deshacer.`}
        loading={deleteFood.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </Screen>
  );
}
