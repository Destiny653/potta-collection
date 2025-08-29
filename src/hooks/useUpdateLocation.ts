import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ILocationPayload } from '@/utils/validation';

export default function useUpdateLocation(id: string) {
  return useMutation({
    mutationFn: async (data: ILocationPayload) => {
      const { error } = await supabase.from('locations').update(data).eq('id', id);
      if (error) throw error;
      return data;
    },
  });
}