import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { CategoryFilterSection } from '@/features/foods/components/CategoryFilterSection';
import { FoodListItem } from '@/features/foods/components/FoodListItem';
import { useFoods } from '@/features/foods/hooks/useFoods';
import type { FoodCategory } from '@/features/foods/schema';
import { useTheme } from '@/hooks/use-theme';

export function FoodsListScreen() {
  const theme = useTheme();
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

  if (!foods || foods.length === 0) {
    return (
      <Screen style={styles.emptyContainer}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.primary }]}>
          <Ionicons name="nutrition-outline" size={32} color={theme.accentSecondary} />
        </View>
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          Todavía no hay Alimentos
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.emptyDescription}>
          Añade uno para poder visualizarlo aquí.
        </ThemedText>
        <Button title="Añadir alimento" onPress={() => router.push('/(app)/(tabs)/despensa/alimentos/nuevo')} />
      </Screen>
    );
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <View style={styles.filters}>
        <TextField label="Buscar" placeholder="Nombre del alimento" value={search} onChangeText={setSearch} />
        <CategoryFilterSection selected={categories} onToggle={toggleCategory} />
      </View>

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
          renderItem={({ item }) => <FoodListItem food={item} userId={userId} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: 16,
  },
  screen: {
    gap: 16,
  },
  filters: {
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
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});
