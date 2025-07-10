import { supabase } from '../supabaseClient';
import { Shift } from '@/types';

export async function getShifts(): Promise<Shift[]> {
  const { data, error } = await supabase.from('shifts').select('*');
  if (error) throw error;
  return data as Shift[];
}

export async function createShift(shift: Omit<Shift, 'id'>): Promise<Shift> {
  // Map camelCase to snake_case for Supabase
  const payload = {
    staff_id: shift.staffId,
    staff_name: shift.staffName,
    date: shift.date,
    start_time: shift.startTime,
    end_time: shift.endTime,
    position: shift.position,
    department: shift.department,
    status: shift.status,
    location: shift.location,
    hourly_rate: shift.hourlyRate,
    notes: shift.notes,
  };
  const { data, error } = await supabase.from('shifts').insert([payload]).select().single();
  if (error) throw error;
  return data as Shift;
}

export async function updateShift(id: string, updates: Partial<Shift>): Promise<Shift> {
  const { data, error } = await supabase.from('shifts').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Shift;
}

export async function deleteShift(id: string): Promise<void> {
  const { error } = await supabase.from('shifts').delete().eq('id', id);
  if (error) throw error;
}

export async function getShiftsByStaffId(staffId: string): Promise<Shift[]> {
  const { data, error } = await supabase.from('shifts').select('*').eq('staff_id', staffId);
  if (error) throw error;
  return data as Shift[];
} 