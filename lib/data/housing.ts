import { supabase } from '../supabaseClient';
import { Housing } from '@/types';

export async function getHousing(): Promise<Housing[]> {
  const { data, error } = await supabase.from('housing').select('*');
  if (error) throw error;
  return data as Housing[];
}

export async function createHousing(housing: Partial<Housing>): Promise<Housing> {
  const { data, error } = await supabase.from('housing').insert([housing]).select().single();
  if (error) throw error;
  return data as Housing;
}

export async function updateHousing(id: string, updates: Partial<Housing>): Promise<Housing> {
  const { data, error } = await supabase.from('housing').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Housing;
}

export async function deleteHousing(id: string): Promise<void> {
  const { error } = await supabase.from('housing').delete().eq('id', id);
  if (error) throw error;
} 