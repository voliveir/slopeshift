import { supabase } from '../supabaseClient';
import { Certification } from '@/types';

function toSnakeCaseCert(cert: any) {
  return {
    staff_id: cert.staff_id || cert.staffId,
    staff_name: cert.staff_name || cert.staffName,
    type: cert.type,
    name: cert.name,
    issue_date: cert.issue_date || cert.issueDate,
    expiry_date: cert.expiry_date || cert.expiryDate,
    status: cert.status,
    issuing_authority: cert.issuing_authority || cert.issuingAuthority,
    certificate_number: cert.certificate_number || cert.certificateNumber,
    notes: cert.notes,
  };
}

export async function getCertifications(): Promise<Certification[]> {
  const { data, error } = await supabase.from('certifications').select('*');
  if (error) throw error;
  return data as Certification[];
}

export async function createCertification(cert: Partial<any>): Promise<Certification> {
  const snakeCert = toSnakeCaseCert(cert);
  let staffName = snakeCert.staff_name;
  if (!staffName && snakeCert.staff_id) {
    const { data: staff } = await supabase.from('staff').select('name').eq('id', snakeCert.staff_id).single();
    staffName = staff?.name || '';
  }
  const { data, error } = await supabase.from('certifications').insert([
    { ...snakeCert, staff_name: staffName }
  ]).select().single();
  if (error) throw error;
  return data as Certification;
}

export async function updateCertification(id: string, updates: Partial<any>): Promise<Certification> {
  const snakeUpdates = toSnakeCaseCert(updates);
  const { data, error } = await supabase.from('certifications').update(snakeUpdates).eq('id', id).select().single();
  if (error) throw error;
  return data as Certification;
}

export async function deleteCertification(id: string): Promise<void> {
  const { error } = await supabase.from('certifications').delete().eq('id', id);
  if (error) throw error;
}

export async function getCertificationsByStaffId(staffId: string): Promise<Certification[]> {
  const { data, error } = await supabase.from('certifications').select('*').eq('staff_id', staffId);
  if (error) throw error;
  return data as Certification[];
} 