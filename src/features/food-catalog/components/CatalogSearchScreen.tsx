import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ReferenceFoodListItem } from '@/features/food-catalog/components/ReferenceFoodListItem';
import { useSearchReferenceFoods } from '@/features/food-catalog/hooks/useSearchReferenceFoods';
import { CategoryFilterSection, type FoodCategory } from '@/features/foods';

export function CatalogSearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<FoodCategory[]>([]);

  function toggleCategory(category: FoodCategory) {
    setCategories((current) => (current.includes(category) ? current.filter((value) => value !== category) : [...current, category]));
  }

  const hasSearched = search.trim().length >= 2 || categories.length > 0;
  const { data: results, isLoading } = useSearchReferenceFoods(search, categories);

  return (
    <Screen padded={false} style={styles.screen}>
      <View style={styles.filters}>
        <TextField label="Buscar" placeholder="Nombre del alimento (inglés o español)" value={search} onChangeText={setSearch} />
        <CategoryFilterSection selected={categories} onToggle={toggleCategory} />
      </View>

      {!hasSearched ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          Escribe al menos 2 letras o elige una categoría para buscar en el catálogo USDA (más de 6.400 alimentos genéricos: frutas,
          verduras, carnes, pescados, lácteos, cereales, legumbres...).
        </ThemedText>
      ) : isLoading ? (
        <FullScreenSpinner />
      ) : !results || results.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          No se han encontrado alimentos.
        </ThemedText>
      ) : (
        <FlatList
          style={styles.flexList}
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ReferenceFoodListItem
              food={item}
              onPress={() =>
                router.push({ pathname: '/(app)/(tabs)/despensa/investigar/[id]', params: { id: item.id } })
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
  },
  filters: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  flexList: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});
