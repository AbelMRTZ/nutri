import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { searchReferenceFoods } from '@/features/food-catalog/api/referenceFoods';
import type { FoodCategory } from '@/features/foods/schema';

export const referenceFoodsSearchQueryKey = (query: string, categories: readonly FoodCategory[]) =>
  ['reference-foods-search', query, [...categories].sort()] as const;

/** No debounce utility exists yet in this codebase — the personal foods picker filters an already-fetched small list client-side, so it never needed one. Searching 6,447 server-side rows on every keystroke would. */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}

export function useSearchReferenceFoods(query: string, categories: readonly FoodCategory[]) {
  const debouncedQuery = useDebouncedValue(query, 300);

  return useQuery({
    queryKey: referenceFoodsSearchQueryKey(debouncedQuery, categories),
    queryFn: () => searchReferenceFoods({ query: debouncedQuery, categories }),
    enabled: debouncedQuery.trim().length >= 2 || categories.length > 0,
  });
}
