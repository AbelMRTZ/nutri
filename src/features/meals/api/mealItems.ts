import { supabase } from '@/lib/supabase/client';
import type { Tables, TablesInsert } from '@/lib/supabase/database.types';

export type MealItemWithFood = Tables<'meal_items'> & { food: Tables<'foods'> };

export async function listMealItems(mealId: string): Promise<MealItemWithFood[]> {
  const { data, error } = await supabase
    .from('meal_items')
    .select('*, food:foods(*)')
    .eq('meal_id', mealId)
    .order('created_at');
  if (error) throw error;
  return data as MealItemWithFood[];
}

export type MealItemInsert = TablesInsert<'meal_items'>;

export async function createMealItem(insert: MealItemInsert): Promise<MealItemWithFood> {
  const { data, error } = await supabase
    .from('meal_items')
    .insert(insert)
    .select('*, food:foods(*)')
    .single();
  if (error) throw error;
  return data as MealItemWithFood;
}

export async function deleteMealItem(id: string) {
  const { error } = await supabase.from('meal_items').delete().eq('id', id);
  if (error) throw error;
}
