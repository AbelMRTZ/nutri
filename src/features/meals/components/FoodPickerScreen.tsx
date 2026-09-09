import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { CategoryFilterSection, useFoods, type FoodCategory } from '@/features/foods';
import { FoodPickerListItem } from '@/features/meals/components/FoodPickerListItem';

export type FoodPickerScreenProps = {
  mealId: string;
};

export function FoodPickerScreen({ mealId }: FoodPickerScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: foods, isLoading } = useFoods(userId);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<FoodCategory[]>([]);

  function toggleCategory(category: FoodCategory) {
    setCategories((current) =>
      current.includes(category) ? current.filter((value) => value !== category) : [...current, category],
    );
  }

  const filteredFoods = useMemo(() => {
    if (!foods) return [];
    return foods.filter((food) => {
      const matchesCategory = categories.length === 0 || categories.includes(food.category);
      const matchesSearch = food.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, categories, search]);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <TextField label="Buscar" placeholder="Nombre del alimento" value={search} onChangeText={setSearch} style={styles.search} />
      <CategoryFilterSection selected={categories} onToggle={toggleCategory} />

      {filteredFoods.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          No se han encontrado alimentos.
        </ThemedText>
      ) : (
        <FlatList
          style={styles.flexList}
          data={filteredFoods}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FoodPickerListItem
              food={item}
              onPress={() =>
                router.push({
                  pathname: '/(app)/(tabs)/despensa/comidas/agregar-alimento/[foodId]',
                  params: { foodId: item.id, mealId },
                })
              }
            />
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
  search: {
    marginBottom: 0,
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
