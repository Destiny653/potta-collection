import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ILocation } from '@/types';

export default function useGetLocations() {
  return useQuery<ILocation[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: true,
  });
}