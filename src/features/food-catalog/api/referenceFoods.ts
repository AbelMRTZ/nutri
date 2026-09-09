import type { FoodCategory } from '@/features/foods/schema';
import { supabase } from '@/lib/supabase/client';

export type SearchReferenceFoodsParams = {
  query: string;
  categories: readonly FoodCategory[];
  limit?: number;
};

/**
 * Server-side search: the catalog has 6,447 rows, far too many to fetch
 * and filter client-side the way the personal `foods` picker does for a
 * user's own (much smaller) list.
 */
export async function searchReferenceFoods({ query, categories, limit = 50 }: SearchReferenceFoodsParams) {
  let request = supabase.from('reference_foods').select('*').order('name_original').limit(limit);

  const trimmed = query.trim();
  if (trimmed) {
    // Most USDA names contain commas ("Broccoli, raw") — PostgREST's `.or()`
    // filter syntax treats a bare comma as a separator between conditions,
    // so an unquoted pattern silently mangles the whole filter (verified
    // directly against the REST API: it returns zero rows). Quoting the
    // pattern is PostgREST's documented escape for that; `"` and `%`/`_`
    // inside the search term itself are escaped so they're taken literally.
    const escaped = trimmed.replace(/["%_\\]/g, '\\$&');
    const pattern = `"%${escaped}%"`;
    request = request.or(`name_original.ilike.${pattern},name_es.ilike.${pattern}`);
  }
  if (categories.length > 0) {
    request = request.in('category', categories);
  }

  const { data, error } = await request;
  if (error) throw error;
  return data;
}

export async function getReferenceFood(id: string) {
  const { data, error } = await supabase.from('reference_foods').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type ReferenceFoodNutrientWithDetails = {
  amount: number;
  unit: string;
  isFlagged: boolean;
  nutrientNbr: string;
  name: string;
  nameEs: string | null;
};

export async function getReferenceFoodNutrients(referenceFoodId: string): Promise<ReferenceFoodNutrientWithDetails[]> {
  const { data, error } = await supabase
    .from('reference_food_nutrients')
    .select('amount, unit, is_flagged, nutrients(usda_nutrient_nbr, name, name_es)')
    .eq('reference_food_id', referenceFoodId);
  if (error) throw error;

  return (data ?? []).flatMap((row) => {
    if (!row.nutrients) return [];
    return [
      {
        amount: row.amount,
        unit: row.unit,
        isFlagged: row.is_flagged,
        nutrientNbr: row.nutrients.usda_nutrient_nbr,
        name: row.nutrients.name,
        nameEs: row.nutrients.name_es,
      },
    ];
  });
}
