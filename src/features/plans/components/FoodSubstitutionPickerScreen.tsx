import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { OptionPicker } from '@/components/option-picker';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { calculateFoodContribution, foodCategoryLabels, foodCategoryOptions, suggestSubstitutes, useFoods } from '@/features/foods';
import { FoodSubstitutionListItem } from '@/features/plans/components/FoodSubstitutionListItem';
import { usePlanItems } from '@/features/plans/hooks/usePlanItems';
import { useSubstitutePlanItemFood } from '@/features/plans/hooks/useSubstitutePlanItemFood';

const ALL_CATEGORIES = 'all' as const;
const categoryFilterOptions = [
  { value: ALL_CATEGORIES, label: 'Todas' },
  ...foodCategoryOptions.map((value) => ({ value, label: foodCategoryLabels[value] })),
];

export type FoodSubstitutionPickerScreenProps = {
  planId: string;
  planItemFoodId: string;
};

export function FoodSubstitutionPickerScreen({ planId, planItemFoodId }: FoodSubstitutionPickerScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: planItems, isLoading: isPlanItemsLoading } = usePlanItems(planId);
  const { data: foods, isLoading: isFoodsLoading } = useFoods(userId);
  const substitute = useSubstitutePlanItemFood(planId);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof categoryFilterOptions)[number]['value']>(ALL_CATEGORIES);

  const currentPlanItemFood = planItems?.flatMap((item) => item.plan_item_foods).find((pif) => pif.id === planItemFoodId);

  const suggestions = useMemo(() => {
    if (!currentPlanItemFood || !foods) return [];
    const target = calculateFoodContribution(currentPlanItemFood.food, currentPlanItemFood.quantity);
    const candidates = foods.filter((food) => food.id !== currentPlanItemFood.food_id);
    return suggestSubstitutes(target, candidates);
  }, [currentPlanItemFood, foods]);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((suggestion) => {
      const matchesCategory = category === ALL_CATEGORIES || suggestion.food.category === category;
      const matchesSearch = suggestion.food.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [suggestions, category, search]);

  if (isPlanItemsLoading || isFoodsLoading) {
    return <FullScreenSpinner />;
  }

  function handlePick(foodId: string, quantity: number) {
    substitute.mutate({ id: planItemFoodId, foodId, quantity }, { onSuccess: () => router.back() });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      {currentPlanItemFood ? (
        <ThemedText type="small" themeColor="textSecondary">
          Ordenados por similitud nutricional con &quot;{currentPlanItemFood.food.name}&quot;. La cantidad se ajusta
          para mantener las mismas calorías.
        </ThemedText>
      ) : null}
      <TextField label="Buscar" placeholder="Nombre del alimento" value={search} onChangeText={setSearch} />
      <OptionPicker label="Categoría" options={categoryFilterOptions} value={category} onChange={setCategory} />

      {filteredSuggestions.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          No se han encontrado alimentos.
        </ThemedText>
      ) : (
        <FlatList
          style={styles.flexList}
          data={filteredSuggestions}
          keyExtractor={(item) => item.food.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FoodSubstitutionListItem suggestion={item} onPress={() => handlePick(item.food.id, item.quantity)} />
          )}
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
