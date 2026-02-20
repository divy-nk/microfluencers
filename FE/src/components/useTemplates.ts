import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setLoading(true);
    const { data, error } = await supabase.from('templates').select('*');
    if (error) setError(error.message);
    else setTemplates(data || []);
    setLoading(false);
  }

  return { templates, loading, error, refresh: fetchTemplates };
}

export async function createTemplate(template: any) {
  const { data, error } = await supabase.from('templates').insert([template]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateTemplate(id: string, updates: any) {
  const { data, error } = await supabase.from('templates').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

export async function getTemplate(id: string) {
  const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
