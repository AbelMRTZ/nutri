import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { OptionPicker } from '@/components/option-picker';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { mealCategoryLabels, mealCategoryOptions, useMeals } from '@/features/meals';
import { MealPickerListItem } from '@/features/plans/components/MealPickerListItem';
import { useAddMealToPlan } from '@/features/plans/hooks/useAddMealToPlan';

const ALL_CATEGORIES = 'all' as const;
const categoryFilterOptions = [
  { value: ALL_CATEGORIES, label: 'Todas' },
  ...mealCategoryOptions.map((value) => ({ value, label: mealCategoryLabels[value] })),
];

export type MealPickerScreenProps = {
  planId: string;
};

export function MealPickerScreen({ planId }: MealPickerScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: meals, isLoading } = useMeals(userId);
  const addMealToPlan = useAddMealToPlan(planId);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof categoryFilterOptions)[number]['value']>(ALL_CATEGORIES);

  const filteredMeals = useMemo(() => {
    if (!meals) return [];
    return meals.filter((meal) => {
      const matchesCategory = category === ALL_CATEGORIES || meal.category === category;
      const matchesSearch = meal.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [meals, category, search]);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  function handlePick(mealId: string) {
    addMealToPlan.mutate(mealId, { onSuccess: () => router.back() });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <TextField label="Buscar" placeholder="Nombre de la comida" value={search} onChangeText={setSearch} />
      <OptionPicker label="Categoría" options={categoryFilterOptions} value={category} onChange={setCategory} />

      {filteredMeals.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          No se han encontrado comidas.
        </ThemedText>
      ) : (
        <FlatList
          style={styles.flexList}
          data={filteredMeals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MealPickerListItem meal={item} onPress={() => handlePick(item.id)} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
  },
  flexList: {
    flex: 1,
  },
  list: {
    paddingBottom: 20,
  },
});
