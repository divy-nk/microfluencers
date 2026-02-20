import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useDrops() {
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrops();
  }, []);

  async function fetchDrops() {
    setLoading(true);
    const { data, error } = await supabase.from('drops').select('*');
    if (error) setError(error.message);
    else setDrops(data || []);
    setLoading(false);
  }

  return { drops, loading, error, refresh: fetchDrops };
}

export async function createDrop(drop: any) {
  const { data, error } = await supabase.from('drops').insert([drop]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateDrop(id: string, updates: any) {
  const { data, error } = await supabase.from('drops').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

export async function getDrop(id: string) {
  const { data, error } = await supabase.from('drops').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
