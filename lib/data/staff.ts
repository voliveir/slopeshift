import { supabase } from '../supabaseClient';
import { Staff } from '@/types';

export async function getStaff(): Promise<Staff[]> {
  const { data, error } = await supabase.from('staff').select('*');
  if (error) throw error;
  if (!data) return [];
  return data.map((staff: any) => ({
    ...staff,
    hireDate: staff.hire_date,
    hourlyRate: staff.hourly_rate,
    emergencyContactName: staff.emergency_contact_name,
    emergencyContactPhone: staff.emergency_contact_phone,
    emergencyContactRelationship: staff.emergency_contact_relationship,
  })) as Staff[];
}

export async function createStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
  const { data, error } = await supabase.from('staff').insert([staff]).select().single();
  if (error) throw error;
  return data as Staff;
}

export async function updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
  const { data, error } = await supabase.from('staff').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Staff;
}

export async function deleteStaff(id: string): Promise<void> {
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) throw error;
} 