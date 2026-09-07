export { FoodsListScreen } from './components/FoodsListScreen';
export { CreateFoodScreen } from './components/CreateFoodScreen';
export { EditFoodScreen } from './components/EditFoodScreen';
export { AlimentosHeaderActions } from './components/AlimentosHeaderActions';
export { useFoods } from './hooks/useFoods';
export { useFood } from './hooks/useFood';
export { useCreateFood } from './hooks/useCreateFood';
export { useUpdateFood } from './hooks/useUpdateFood';
export { useDeleteFood } from './hooks/useDeleteFood';
export {
  foodCategoryOptions,
  foodCategoryLabels,
  servingTypeOptions,
  servingTypeLabels,
  optionalNutrientFields,
  nutrientLabels,
} from './schema';
export type { FoodFormValues, OptionalNutrientField } from './schema';
export { calculateFoodContribution } from './calculations/contribution';
export type { FoodContribution } from './calculations/contribution';
export { suggestSubstitutes } from './calculations/substitution';
export type { SubstitutionSuggestion } from './calculations/substitution';

