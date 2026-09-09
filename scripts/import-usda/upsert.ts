import { supabaseAdmin } from './supabaseAdmin';
import type { Tables, TablesInsert } from '../../src/lib/supabase/database.types';

// Batched so a run over ~530k nutrient rows doesn't send one giant request
// (or one request per row). `upsert` with `onConflict` matching each
// table's unique constraint is what makes re-running the whole import
// idempotent: a second run updates the same rows in place instead of
// duplicating them. Each batch is `.select()`-ed back so callers can pick
// up the resolved `id` of every row (needed to link nutrients into
// reference_food_nutrients by uuid, not by USDA's own ids).
const BATCH_SIZE = 500;

export async function upsertNutrients(rows: TablesInsert<'nutrients'>[]): Promise<Tables<'nutrients'>[]> {
  const results: Tables<'nutrients'>[] = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabaseAdmin
      .from('nutrients')
      .upsert(batch, { onConflict: 'usda_nutrient_nbr' })
      .select();
    if (error) throw new Error(`Upsert into nutrients failed (batch starting at ${i}): ${error.message}`);
    results.push(...(data ?? []));
  }
  return results;
}

export async function upsertReferenceFoods(rows: TablesInsert<'reference_foods'>[]): Promise<Tables<'reference_foods'>[]> {
  const results: Tables<'reference_foods'>[] = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabaseAdmin
      .from('reference_foods')
      .upsert(batch, { onConflict: 'source,source_id' })
      .select();
    if (error) throw new Error(`Upsert into reference_foods failed (batch starting at ${i}): ${error.message}`);
    results.push(...(data ?? []));
  }
  return results;
}

export async function upsertReferenceFoodNutrients(rows: TablesInsert<'reference_food_nutrients'>[]): Promise<number> {
  let count = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error, count: batchCount } = await supabaseAdmin
      .from('reference_food_nutrients')
      .upsert(batch, { onConflict: 'reference_food_id,nutrient_id', count: 'exact' });
    if (error) {
      throw new Error(`Upsert into reference_food_nutrients failed (batch starting at ${i}): ${error.message}`);
    }
    count += batchCount ?? batch.length;
  }
  return count;
}
