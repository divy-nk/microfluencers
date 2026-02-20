import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useAssets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    setLoading(true);
    const { data, error } = await supabase.from('assets').select('*');
    if (error) setError(error.message);
    else setAssets(data || []);
    setLoading(false);
  }

  return { assets, loading, error, refresh: fetchAssets };
}

export async function createAsset(asset: any) {
  const { data, error } = await supabase.from('assets').insert([asset]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateAsset(id: string, updates: any) {
  const { data, error } = await supabase.from('assets').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

export async function getAsset(id: string) {
  const { data, error } = await supabase.from('assets').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
