import { MealCategoryColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MealCategory } from '@/features/meals/schema';

/** Resolves a meal category's accent color for the current scheme — same fallback as useTheme(). */
export function useMealCategoryColor(category: MealCategory): string {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return MealCategoryColors[theme][category];
}
