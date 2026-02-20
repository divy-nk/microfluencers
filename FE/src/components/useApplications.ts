import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    const { data, error } = await supabase.from('applications').select('*');
    if (error) setError(error.message);
    else setApplications(data || []);
    setLoading(false);
  }

  return { applications, loading, error, refresh: fetchApplications };
}

export async function createApplication(application: any) {
  const { data, error } = await supabase.from('applications').insert([application]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateApplication(id: string, updates: any) {
  const { data, error } = await supabase.from('applications').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

export async function getApplication(id: string) {
  const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
