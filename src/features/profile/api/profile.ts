import { supabase } from '@/lib/supabase/client';
import type { TablesUpdate } from '@/lib/supabase/database.types';

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export type ProfileUpdate = TablesUpdate<'profiles'>;

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}
