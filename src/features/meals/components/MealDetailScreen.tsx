import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ErrorBanner } from '@/components/error-banner';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { MealForm } from '@/features/meals/components/MealForm';
import { MealItemRow } from '@/features/meals/components/MealItemRow';
import { useDeleteMeal } from '@/features/meals/hooks/useDeleteMeal';
import { useMeal } from '@/features/meals/hooks/useMeal';
import { useMealItems } from '@/features/meals/hooks/useMealItems';
import { useUpdateMeal } from '@/features/meals/hooks/useUpdateMeal';
import { toFormDefaults } from '@/features/meals/mappers';
import type { MealFormValues } from '@/features/meals/schema';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';

export type MealDetailScreenProps = {
  id: string;
};

export function MealDetailScreen({ id }: MealDetailScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: meal, isLoading } = useMeal(id);
  const { data: items } = useMealItems(id);
  const updateMeal = useUpdateMeal(id, userId);
  const deleteMeal = useDeleteMeal(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();

  if (isLoading || !meal) {
    return <FullScreenSpinner />;
  }

  function handleSubmit(values: MealFormValues) {
    updateMeal.mutate({ ...values, recipe_url: values.recipe_url ? values.recipe_url : null });
  }

  function handleDelete() {
    deleteMeal.mutate(id, {
      onSuccess: () => router.back(),
      onError: (error) => {
        setDeleteError(friendlyDeleteErrorMessage(error, 'Esta comida está en uso en un plan y no se puede eliminar.'));
        setConfirmVisible(false);
      },
    });
  }

  return (
    <View style={styles.root}>
      <Screen scroll style={styles.content}>
        <MealForm
          defaultValues={toFormDefaults(meal)}
          onSubmit={handleSubmit}
          submitting={updateMeal.isPending}
          submitLabel="Guardar cambios"
        />

        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <ThemedText type="smallBold">Alimentos</ThemedText>
            <Button
              variant="secondary"
              title="Añadir alimento"
              onPress={() =>
                router.push({ pathname: '/(app)/(tabs)/despensa/comidas/agregar-alimento', params: { mealId: id } })
              }
            />
          </View>

          {!items || items.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              Todavía no has añadido ningún alimento.
            </ThemedText>
          ) : (
            items.map((item) => <MealItemRow key={item.id} item={item} mealId={id} />)
          )}
        </View>

        <Button variant="ghost" title="Eliminar comida" onPress={() => setConfirmVisible(true)} />

        <ConfirmDialog
          visible={confirmVisible}
          title="Eliminar comida"
          description={`¿Seguro que quieres eliminar "${meal.name}"? Esta acción no se puede deshacer.`}
          loading={deleteMeal.isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirmVisible(false)}
        />
      </Screen>

      {deleteError ? <ErrorBanner message={deleteError} onDismiss={() => setDeleteError(undefined)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    gap: 24,
  },
  itemsSection: {
    gap: 8,
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
