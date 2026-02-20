import { useEffect, useState } from 'react';
import { useAuth } from './auth';
import { supabase } from './supabaseClient';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }
      // Assume a 'profiles' table with a 'role' column
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (error) {
        setRole(null);
      } else {
        setRole(data?.role || null);
      }
      setLoading(false);
    }
    fetchRole();
  }, [user]);

  return { role, loading };
}
